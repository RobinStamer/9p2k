const Constants       = require('../protocol/Constants');
const { FileService } = require('../fs/FileService');
const { NString }     = require('../protocol/NString');
const { RMessage }    = require('./RMessage');
const { QSession }    = require('../session/QSession');

class RReadMessage extends RMessage
{
	static encode(tMessage)
	{
		const file = FileService.getByFid(tMessage.fid);

		if(!file || !file.exists)
		{
			return RErrorMessage.encode(tMessage);
		}

		if(!file.directory)
		{
			const detail = {
				content:  null
				, file:   file ? file.path : false
				, offset: tMessage.offset
				, count:  tMessage.count
				, fid:    tMessage.fid
			};

			process.stderr.write(`\u001b[33m READ: ${tMessage.tag} ${tMessage.fid} ${tMessage.offset} ${file.fullPath()}\u001b[39m\n`);

			const rMessage   = new this.prototype.constructor;

			rMessage.type    = Constants.R_READ;
			rMessage.TYPE    = 'R_READ';
			rMessage.tag     = tMessage.tag;
			rMessage.content = detail.content = file.getContent(tMessage.offset, tMessage.count);

			const bytes = [
				0, 0, 0, 0,
				Constants.R_READ,
				... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
				... new Uint8Array(new Uint32Array([rMessage.content.length]).buffer),
				... rMessage.content,
			];

			Object.assign(bytes, new Uint8Array(new Uint32Array([rMessage.size = bytes.length]).buffer));

			rMessage.blob = Buffer.from(new Uint8Array(bytes));

			return rMessage;
		}
		else
		{
			const entries = [0, 0, 0, 0];

			const children = file.getChildren().filter(c => c.exists);

			const detail = {
				content:  children
				, file:   file
				, offset: tMessage.offset
				, count:  tMessage.count
				, fid:    tMessage.fid
			};

			if(!tMessage.offset)
			{
				process.stderr.write(`\u001b[36m LIST: ${tMessage.tag} ${tMessage.fid} ${tMessage.offset} ${file.fullPath()}\u001b[39m\n`);
			}

			let index = 0;

			const entryList = [];

			for(const file of children)
			{
				const name  = file.name;
				const mode  = (file.mode << 0) + (file.directory ? 0x80000000 : 0);
				const qid   = QSession.getQid(file);
				const entry = [
					... new Uint8Array(new Uint16Array([0]).buffer),    // size
					... new Uint8Array(new Uint16Array([0]).buffer),    // type
					... new Uint8Array(new Uint32Array([0]).buffer),    // dev
					... qid,                                            // qid
					... new Uint8Array(new Uint32Array([mode]).buffer), // mode
					... new Uint8Array(new Uint32Array([Math.trunc(file.aTime ?? (Date.now() / 1000))]).buffer), // atime
					... new Uint8Array(new Uint32Array([Math.trunc(file.mTime ?? 0)]).buffer),                 // mtime
					... new Uint8Array(new BigUint64Array([BigInt(file.size ?? 0)]).buffer),     // length
					... NString.encode(file.root ? '/' : file.name),    // Name
					... NString.encode('sean'),                         // uid
					... NString.encode('sean'),                         // gid
					... NString.encode('sean'),                         // muid
				];

				entryList.push(entry);
			}

			const discard = [];
			const include = [];

			for(const entry of entryList)
			{
				if(discard.length < tMessage.offset)
				{
					discard.push(...entry);
					continue;
				}

				if(entries.length + entry.length > tMessage.count)
				{
					break;
				}

				entries.push(...entry);
			}

			Object.assign(entries, new Uint8Array(new Uint32Array([-4+entries.length]).buffer));

			const bytes = [
				0, 0, 0, 0,
				Constants.R_READ,
				... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
				... entries
			];

			const rMessage = new this.prototype.constructor;

			Object.assign(bytes, new Uint8Array(new Uint32Array([rMessage.size = bytes.length]).buffer));

			rMessage.size = bytes.length;
			rMessage.type = Constants.R_READ;
			rMessage.TYPE = 'R_READ';
			rMessage.tag  = tMessage.tag;

			rMessage.blob = Buffer.from(new Uint8Array(bytes));

			return rMessage;
		}
	}
}

module.exports = { RReadMessage };
