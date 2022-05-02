const Constants           = require('../protocol/Constants');
const { NString }         = require('../protocol/NString');

const { Qid }             = require('../session/Qid');
const { QSession }        = require('../session/QSession');

const { EventTarget }     = require('../events/EventTarget');
const { Event }           = require('../events/Event');

const { File }            = require('../fs/File');
const { FileService }     = require('../fs/FileService');

const { Message }         = require('./Message');
const { RMessage }        = require('./RMessage');
const { TMessage }        = require('./TMessage');

const { RErrorMessage }   = require('./RErrorMessage');

const { RVersionMessage } = require('./RVersionMessage');
const { TVersionMessage } = require('./TVersionMessage');

const { TAttachMessage }  = require('./TAttachMessage');
const { RAttachMessage }  = require('./RAttachMessage');

const { TStatMessage }    = require('./TStatMessage');
const { RStatMessage }    = require('./RStatMessage');

const { TWStatMessage }   = require('./TWStatMessage');
const { RWStatMessage }   = require('./RWStatMessage');

const { TRemoveMessage }  = require('./TRemoveMessage');
const { RRemoveMessage }  = require('./RRemoveMessage');

const { RGetAttrMessage } = require('./RGetAttrMessage');
const { TGetAttrMessage } = require('./TGetAttrMessage');

const { RSetAttrMessage } = require('./RSetAttrMessage');
const { TSetAttrMessage } = require('./TSetAttrMessage');

const { RWalkMessage }    = require('./RWalkMessage');
const { TWalkMessage }    = require('./TWalkMessage');

class RlOpenMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const file = FileService.getByFid(message.fid);
		const qid  = QSession.getQid(file);

		const bytes = [
			0, 0, 0, 0,
			Constants.R_LOPEN,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			... qid,
			0, 0, 0, 0,
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		instance.size = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = Constants.R_LOPEN;
		instance.TYPE = 'R_LOPEN';
		instance.tag  = message.tag;

		return instance;
	}
}

class TlOpenMessage extends TMessage
{
	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid   = dataView.getUint32(7, true);
		instance.mode  = blob.slice(11, 11 + 4);

		return instance;
	}

	response()
	{
		const file = FileService.getByFid(this.fid);

		if(file)
		{
			const response = RlOpenMessage.encode(this);

			return response;
		}

		return super.response();
	}
}

class RReadDirMessage extends RMessage
{
	static encode(tMessage)
	{
		const instance = new this.prototype.constructor;

		const entries = [0, 0, 0, 0];

		const parent = FileService.getByFid(tMessage.fid);

		if(!tMessage.offset)
		{
			let index = 0;

			const children = parent.getChildren().filter(c => c.exists);

			for(const file of children)
			{
				const name = file.name;

				const qid   = QSession.getQid(file);
				const entry = [
					...qid,
					0x04,
					... new Uint8Array(new BigUint64Array([BigInt(++index)]).buffer),
					... NString.encode(name)
				];

				entries.push(...entry);
			}

			Object.assign(entries, new Uint8Array(new Uint32Array([entries.length]).buffer));
		}

		const bytes = [
			0, 0, 0, 0,
			Constants.R_READDIR,
			... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
			... entries
		];

		instance.size = bytes.length;

		Object.assign(bytes, new Uint8Array(new Uint32Array([bytes.length]).buffer));

		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = Constants.R_READDIR;
		instance.TYPE = 'R_READDIR';
		instance.tag  = tMessage.tag;

		return instance;
	}
}

class TReadDirMessage extends TMessage
{
	static responseType = RReadDirMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.offset = dataView.getBigInt64(9, true);
		instance.count  = dataView.getUint32(13, true);

		return instance;
	}
}

class RStatFsMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const bytes = [
			0, 0, 0, 0,
			Constants.R_STATFS,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			0x97, 0x19, 0x02, 0x01,
			0x00, 0x10, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,  0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,  0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,  0x00, 0x00, 0x00, 0x00,
			0x01, 0x00, 0x00, 0x00,  0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,  0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00,  0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		instance.size = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = Constants.R_STATFS;
		instance.TYPE = 'R_STATFS';
		instance.tag  = message.tag;

		return instance;
	}
}

class TStatFsMessage extends TMessage
{
	static responseType = RStatFsMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);

		return instance;
	}
}

class RXAttrWalkMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const bytes = [
			0, 0, 0, 0,
			Constants.R_XATTRWALK,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			0x00, 0x00, 0x00, 0x00,  0x00, 0x00, 0x00, 0x00,
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		instance.size = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = Constants.R_XATTRWALK;
		instance.TYPE = 'R_XATTRWALK';
		instance.tag  = message.tag;

		return instance;
	}
}

class TXAttrWalkMessage extends TMessage
{
	static responseType = RXAttrWalkMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.newFid = dataView.getUint32(11, true);
		instance.wName  = String( NString.decode(blob, 15) );

		return instance;
	}
}

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

class TReadMessage extends TMessage
{
	static responseType = RReadMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.offset = dataView.getBigInt64(11, true);
		instance.count  = dataView.getUint32(19, true);

		return instance;
	}
}

class RWriteMessage extends RMessage
{
	static encode(tMessage)
	{
		const file = FileService.getByFid(tMessage.fid);

		process.stderr.write(`\u001b[35mWRITE: ${tMessage.tag} ${tMessage.fid} ${file.path}\u001b[39m `);

		const bytes = [
			0, 0, 0, 0,
			Constants.R_WRITE,
			... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
			... new Uint8Array(new Uint32Array([tMessage.count]).buffer)
		];

		file.setContent(String(tMessage.data) || tMessage.data);

		const rMessage = new this.prototype.constructor;

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		rMessage.size = bytes.length;
		rMessage.blob = Buffer.from(new Uint8Array(bytes));

		rMessage.type = Constants.R_WRITE;
		rMessage.TYPE = 'R_WRITE';
		rMessage.tag  = tMessage.tag;

		return rMessage;
	}
}

class TWriteMessage extends TMessage
{
	static responseType = RWriteMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.offset = dataView.getBigInt64(11, true);
		instance.count  = dataView.getUint32(19, true);
		instance.data   = blob.slice(23);

		return instance;
	}
}

class ROpenMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;
		const file     = FileService.getByFid(message.fid);
		const bytes    = [
			0, 0, 0, 0,
			Constants.R_OPEN,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			... QSession.getQid(file),
			... new Uint8Array(new Uint32Array([0]).buffer),
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		instance.size = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = Constants.R_OPEN;
		instance.TYPE = 'R_OPEN';
		instance.tag  = message.tag;

		return instance;
	}
}

class TOpenMessage extends TMessage
{
	static responseType = ROpenMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.mode   = dataView.getUint8(11, true);

		return instance;
	}
}

class RClunkMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const bytes   = [
			0, 0, 0, 0,
			Constants.R_CLUNK,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		instance.size = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = Constants.R_CLUNK;
		instance.TYPE = 'R_CLUNK';
		instance.tag  = message.tag;

		return instance;
	}
}

class TClunkMessage extends TMessage
{
	static responseType = RClunkMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid   = dataView.getUint32(7, true);

		return instance;
	}

	response()
	{
		FileService.forgetFid(this.fid);

		return super.response();
	}
}

class RFlushMessage extends RMessage{}
class TFlushMessage extends TMessage{}

class RlErrorMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const bytes   = [
			0, 0, 0, 0,
			Constants.R_LERROR,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			0x2, 0, 0, 0,
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		instance.size = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = Constants.R_LERROR;
		instance.TYPE = 'R_LERROR';
		instance.tag  = message.tag;

		return instance;
	}
}

class MessageService
{
	static target = new EventTarget;

	static parse(blob)
	{
		let index = 0;

		const messages = [];

		while(index < blob.length)
		{
			const slice    = new Uint8Array(blob.slice(index));

			const dataView = new DataView(slice.buffer);
			const length   = dataView.getUint32(0, true);
			const current  = blob.slice(index, index + length);

			index += length;

			const message = Message.parse(current);

			switch(message.type)
			{
				case Constants.T_VERSION:
					messages.push( TVersionMessage.parse(current) );
					break;

				case Constants.R_VERSION:
					messages.push( RVersionMessage.parse(current) );
					break;

				case Constants.T_ATTACH:
					messages.push( TAttachMessage.parse(current) );
					break;

				case Constants.R_ATTACH:
					messages.push( RAttachMessage.parse(current) );
					break;

				case Constants.T_STAT:
					messages.push( TStatMessage.parse(current) );
					break;

				case Constants.R_STAT:
					messages.push( RStatMessage.parse(current) );
					break;

				case Constants.T_WSTAT:
					messages.push( TWStatMessage.parse(current) );
					break;

				case Constants.R_WSTAT:
					messages.push( RWStatMessage.parse(current) );
					break;

				case Constants.T_REMOVE:
					messages.push( TRemoveMessage.parse(current) );
					break;

				case Constants.R_REMOVE:
					messages.push( RRemoveMessage.parse(current) );
					break;

				case Constants.T_CLUNK:
					messages.push( TClunkMessage.parse(current) );
					break;

				case Constants.R_CLUNK:
					messages.push( RClunkMessage.parse(current) );
					break;

				case Constants.T_GETATTR:
					messages.push( TGetAttrMessage.parse(current) );
					break;

				case Constants.R_GETATTR:
					messages.push( RGetAttrMessage.parse(current) );
					break;

				case Constants.T_SETATTR:
					messages.push( TSetAttrMessage.parse(current) );
					break;

				case Constants.R_SETATTR:
					messages.push( RSetAttrMessage.parse(current) );
					break;

				case Constants.T_WALK:
					messages.push( TWalkMessage.parse(current) );
					break;

				case Constants.R_WALK:
					messages.push( RWalkMessage.parse(current) );
					break;

				case Constants.T_XATTRWALK:
					messages.push( TXAttrWalkMessage.parse(current) );
					break;

				case Constants.T_LOPEN:
					messages.push( TlOpenMessage.parse(current) );
					break;

				case Constants.R_LOPEN:
					messages.push( RlOpenMessage.parse(current) );
					break;

				case Constants.T_READDIR:
					messages.push( TReadDirMessage.parse(current) );
					break;

				case Constants.R_READDIR:
					messages.push( RReadDirMessage.parse(current) );
					break;

				case Constants.T_READ:
					messages.push( TReadMessage.parse(current) );
					break;

				case Constants.R_READ:
					messages.push( RReadMessage.parse(current) );
					break;

				case Constants.T_WRITE:
					messages.push( TWriteMessage.parse(current) );
					break;

				case Constants.R_WRITE:
					messages.push( RWriteMessage.parse(current) );
					break;

				case Constants.T_STATFS:
					messages.push( TStatFsMessage.parse(current) );
					break;

				case Constants.R_STATFS:
					messages.push( RStatFsMessage.parse(current) );
					break;

				case Constants.T_OPEN:
					messages.push( TOpenMessage.parse(current) );
					break;

				case Constants.R_OPEN:
					messages.push( ROpenMessage.parse(current) );
					break;

				case Constants.T_FLUSH:
					messages.push( TFlushMessage.parse(current) );
					break;

				case Constants.R_FLUSH:
					messages.push( RFlushMessage.parse(current) );
					break;

				default:
					messages.push( Message.parse(current) );
					break;
			}
		}

		return messages;
	}
}

module.exports = { MessageService };
