const FileService = require('../fs/FileService').FileService;
const Constants   = require('./Constants');
const RMessage    = require('./RMessage').RMessage;
const QSession    = require('../session/QSession').QSession;
const NString     = require('../protocol/NString').NString;

class RStatMessage extends RMessage
{
	static encode(tMessage)
	{
		const rMessage = new this.prototype.constructor;

		const file = FileService.getByFid(tMessage.fid);

		if(!file || !file.exists)
		{
			return RErrorMessage.encode(tMessage);
		}

		const stats = [0, 0];

		if(file)
		{
			const mode = (file.mode << 0) + (file.directory ? 0x80000000 : 0);
			const stat = [
				... new Uint8Array(new Uint16Array([0]).buffer),    // size
				... new Uint8Array(new Uint16Array([77]).buffer),   // type
				... new Uint8Array(new Uint32Array([47]).buffer),   // dev
				... QSession.getQid(file),                          // QID
				... new Uint8Array(new Uint32Array([mode]).buffer), // mode
				... new Uint8Array(new Uint32Array([Math.trunc(Date.now() / 1000)]).buffer), // atime
				... new Uint8Array(new Uint32Array([Math.trunc(0)]).buffer),                 // mtime
				... new Uint8Array(new BigUint64Array([BigInt(file.size ?? 0)]).buffer),     // length
				... NString.encode(file.root ? '/' : file.name),    // Name
				... NString.encode('sean'),                         // uid
				... NString.encode('sean'),                         // gid
				... NString.encode('sean'),                         // muid
			];

			Object.assign(stat, new Uint8Array(new Uint16Array([-2+stat.length]).buffer));

			stats.push(...stat);
		}

		Object.assign(stats, new Uint8Array(new Uint16Array([-2+stats.length]).buffer));

		const bytes = [
			0, 0, 0, 0,
			Constants.R_STAT,
			... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
			... stats
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		rMessage.size = bytes.length;
		rMessage.blob = Buffer.from(new Uint8Array(bytes));

		rMessage.type = Constants.R_STAT;
		rMessage.TYPE = 'R_STAT';
		rMessage.tag  = tMessage.tag;

		return rMessage;
	}
}

module.exports = { RStatMessage };
