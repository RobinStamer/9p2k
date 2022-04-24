const packets  = require('./packets');

const NString     = require('./NString').NString;

const Qid         = require('./Qid').Qid;
const QSession    = require('./QSession').QSession;

const File        = require('./File').File;
const FileService = require('./FileService').FileService;
const FilesExist  = new Set;

const dirs  = Array(3).fill(0).map(
	(_,k) => 'Entry-' + String.fromCharCode(65+k)
);

const files = Array(3).fill(0).map(
	(_,k) => 'File-' + String.fromCharCode(65+k)
);

dirs.map(d => {
	FilesExist.add(d);
	const dir = FileService.getByPath(d, true)
	dir.directory = true;
});

files.map(f => {
	FilesExist.add(f);
	const file = FileService.getByPath(f);
});

class Message
{
	blob;
	size;
	TYPE;
	type;

	static parse(blob)
	{
		const instance = new this.prototype.constructor;
		const dataView = new DataView(new Uint8Array([...blob]).buffer);

		instance.view  = dataView;

		instance.size  = dataView.getUint32(0, true);
		instance.type  = dataView.getUint8(4, true);

		for(const packetType in packets)
		{
			if(instance.type === packets[packetType])
			{
				instance.TYPE = packetType;
			}
		}

		instance.blob = blob;

		return instance;
	}

	encode(message)
	{

	}

	toString()
	{
		return this.blob.toString();
	}
}

class TMessage extends Message
{
	tag;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.tag   = dataView.getUint16(5, true);

		return instance;
	}
}

class RMessage extends Message
{
	tag;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.tag   = dataView.getUint16(5, true);

		return instance;
	}
}

class TVersionMessage extends TMessage
{
	msize;
	version;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.version = String( NString.decode(blob, 11) );

		return instance;
	}

	response()
	{
		const blob = Buffer.alloc(this.blob.length);

		this.blob.copy(blob);

		const dataView = new DataView(blob.buffer);

		dataView.setUint8(4, packets.R_VERSION, true);

		return RVersionMessage.parse(blob);
	}
}

class RVersionMessage extends RMessage
{
	msize;
	version;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.msize   = dataView.getUint32(7, true);
		instance.version = blob.slice(11);

		return instance;
	}
}

class TAttachMessage extends TMessage
{
	fid;
	afid;
	aName;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid   = dataView.getUint32(7, true);
		instance.afid  = dataView.getUint32(11, true);

		instance.uName = String( NString.decode(blob, 15) );
		instance.aName = String( NString.decode(blob, 17 + instance.uName.length) );

		return instance;
	}

	response()
	{
		const response = RAttachMessage.encode(this);

		return response;
	}
}

class RAttachMessage extends RMessage
{
	static encode(message)
	{
		const file = FileService.getByPath(message.aName, true);
		const qid  = QSession.getQid(file);

		FileService.assignFid(message.fid, file);

		file.directory = true;
		file.size      = 69;

		const instance = new this.prototype.constructor;

		const bytes    = [
			0, 0, 0, 0,
			packets.R_ATTACH,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			... qid,
		];

		bytes[0] = bytes.length;

		instance.blob = Buffer.from(new Uint8Array(bytes));
		instance.size = bytes[0];
		instance.type = packets.R_ATTACH;
		instance.TYPE = 'R_ATTACH';
		instance.tag  = message.tag;

		return instance;
	}
}

class TStatMessage extends TMessage
{
	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid   = dataView.getUint32(7, true);

		return instance;
	}

	response()
	{
		const response = RStatMessage.encode(this);

		return response;
	}
}

class RStatMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const stat = [
			... new Uint8Array(new Uint16Array([0]).buffer),      // size
			... new Uint8Array(new Uint16Array([0]).buffer),      // type
			... new Uint8Array(new Uint32Array([0]).buffer),      // dev
			... new Uint8Array([0x80]),                           // type
			... new Uint8Array(new Uint32Array([0]).buffer),      // vers
			... new Uint8Array(new Uint32Array([0, 0]).buffer),   // path
			... new Uint8Array([0x7, 0x7, 0x7, 0x80]),            // mode
			... new Uint8Array(new Uint32Array([0]).buffer),      // atime
			... new Uint8Array(new Uint32Array([0]).buffer),      // mtime
			... new Uint8Array(new Uint32Array([0, 0]).buffer),   // length
			... new Uint8Array([1, 0x0, 0x2F]),                   // name
			... new Uint8Array([4, 0x0, 0x73, 0x65, 0x61, 0x6e]), // uid
			... new Uint8Array([4, 0x0, 0x73, 0x65, 0x61, 0x6e]), // gid
			... new Uint8Array([4, 0x0, 0x73, 0x65, 0x61, 0x6e]), // muid
		];

		stat.splice(0, 2, ... new Uint8Array(new Uint16Array([stat.length]).buffer));

		const bytes = [
			0, 0, 0, 0,
			packets.R_STAT,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			... stat
		];

		bytes[0] = bytes.length;

		instance.size = bytes[0];
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = packets.R_STAT;
		instance.TYPE = 'R_STAT';
		instance.tag  = message.tag;

		return instance;
	}
}

class TGetAttrMessage extends TMessage
{
	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid   = dataView.getUint32(7, true);

		return instance;
	}

	response()
	{
		const response = RGetAttrMessage.encode(this);

		return response;
	}
}

class RGetAttrMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;
		const file = FileService.getByFid(message.fid);

		const qid  = QSession.getQid(file);

		file.aTime = 0;//Math.trunc(Date.now() / 1000);
		file.size  = file.directory ? 0 : 10;

		const bytes   = [
			0, 0, 0, 0,
			packets.R_GETATTR,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			... new Uint8Array(new Uint32Array([0x3FFF, 0x0]).buffer),
			... qid,
			... file.directory ? [0xED, 0x41, 0x0, 0x0] : [0xED, 0x81, 0x0, 0x0], // mode
			... [0x10, 0x27, 0x0, 0x0],      // uid
			... [0x10, 0x27, 0x0, 0x0],      // gid
			... [1, 0, 0, 0, 0, 0, 0, 0],    // nlink
			... [0, 0, 0, 0, 0, 0, 0, 0],    // rdev
			... new Uint8Array(new BigInt64Array([BigInt(file.size ?? 0)]).buffer), // size
			... [0, 0x10, 0, 0, 0, 0, 0, 0], // blockSize
			... [0, 0, 0, 0, 0, 0, 0, 0],    // blocks
			... [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // mTime
			... [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // mTime
			... [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // cTime
			... [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // bTime
			... [0, 0, 0, 0, 0, 0, 0, 0],    // gen
			... [0, 0, 0, 0, 0, 0, 0, 0],    // dataversion
		];

		instance.size = bytes[0] = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = packets.R_GETATTR;
		instance.TYPE = 'R_GETATTR';
		instance.tag  = message.tag;

		return instance;
	}
}

class TWalkMessage extends TMessage
{
	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.newFid = dataView.getUint32(11, true);
		instance.walks  = dataView.getUint16(15, true);

		if(instance.walks)
		{
			instance.wName = String( NString.decode(blob, 17) );
		}

		return instance;
	}

	response()
	{
		const parent = this.file = FileService.getByFid(this.fid);

		if(!this.walks)
		{
			if(this.file)
			{
				FileService.assignFid(this.newFid, this.file);
			}

			const response = RWalkMessage.encode(this);

			return response;
		}

		if(FilesExist.has(this.wName))
		{
			const fullPath = this.file.fullPath() + '/' + this.wName;
			const subFile  = this.file = FileService.getByPath(fullPath, !!this.wName.match(/^Entry/));

			FileService.assignFid(this.newFid, this.file);

			// if(!this.file.directory)
			// {
			// 	console.log('FWALK: ', this.newFid, this.file.path);
			// }

			const response = RWalkMessage.encode(this);

			return response;
		}

		const response = RlErrorMessage.encode(this);

		return response;
	}
}

class RWalkMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;
		const qid = QSession.getQid(message.file);

		const bytes   = [
			0, 0, 0, 0,
			packets.R_WALK,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			... new Uint8Array(new Uint16Array([(message.walks ? 1 : 0)]).buffer),
			... qid
		];

		instance.size = bytes[0] = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = packets.R_WALK;
		instance.TYPE = 'R_WALK';
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

		const response = RlErrorMessage.encode(this);

		return response;
	}
}

class RlOpenMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const file = FileService.getByFid(message.fid);
		const qid  = QSession.getQid(file);

		const bytes = [
			0, 0, 0, 0,
			packets.R_LOPEN,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			... qid,
			0, 0, 0, 0,
		];

		instance.size = bytes[0] = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = packets.R_LOPEN;
		instance.TYPE = 'R_LOPEN';
		instance.tag  = message.tag;

		return instance;
	}
}

class TReadDirMessage extends TMessage
{
	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.offset = dataView.getBigInt64(9, true);
		instance.count  = dataView.getUint32(13, true);

		return instance;
	}

	response()
	{
		const response = RReadDirMessage.encode(this);

		return response;
	}
}

class RReadDirMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const entries = [0, 0, 0, 0];

		const parent = FileService.getByFid(message.fid);

		if(!message.offset)
		{
			let index = 0;

			console.log('SCAN: ', message.fid, parent.path);

			for(const path of [...dirs, ...files])
			{
				const filePath = path;

				const file  = FileService.getByPath(filePath, !!path.match(/^Entry/));

				file.parent = parent;

				const qid   = QSession.getQid(file);
				const entry = [
					...qid,
					0x04,
					... new Uint8Array(new BigInt64Array([BigInt(++index)]).buffer),
					... new Uint8Array(new Uint16Array([path.length]).buffer),
					... Buffer.from(path, 'utf-8'),
				];

				entries.push(...entry);
			}

			Object.assign(entries, new Uint8Array(new Uint32Array([entries.length]).buffer));
		}

		const bytes = [
			0, 0, 0, 0,
			packets.R_READDIR,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			... entries
		];

		instance.size = bytes.length;

		Object.assign(bytes, new Uint8Array(new Uint32Array([bytes.length]).buffer));

		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = packets.R_READDIR;
		instance.TYPE = 'R_READDIR';
		instance.tag  = message.tag;

		return instance;
	}
}

class TStatFsMessage extends TMessage
{
	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);

		return instance;
	}

	response()
	{
		const response = RStatFsMessage.encode(this);

		return response;
	}
}

class RStatFsMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const bytes = [
			0, 0, 0, 0,
			packets.R_STATFS,
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

		instance.size = bytes[0] = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = packets.R_STATFS;
		instance.TYPE = 'R_STATFS';
		instance.tag  = message.tag;

		return instance;
	}
}

class TXAttrWalkMessage extends TMessage
{
	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.newFid = dataView.getUint32(11, true);
		instance.wName = String( NString.decode(blob, 15) );

		return instance;
	}

	response()
	{
		const response = RXAttrWalkMessage.encode(this);

		return response;
	}
}

class RXAttrWalkMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const bytes = [
			0, 0, 0, 0,
			packets.R_XATTRWALK,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			0x00, 0x00, 0x00, 0x00,  0x00, 0x00, 0x00, 0x00,
		];

		instance.size = bytes[0] = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = packets.R_XATTRWALK;
		instance.TYPE = 'R_XATTRWALK';
		instance.tag  = message.tag;

		return instance;
	}
}

class TReadMessage extends TMessage
{
	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.offset = dataView.getBigInt64(11, true);
		instance.count  = dataView.getUint32(19, true);

		return instance;
	}

	response()
	{
		const response = RReadMessage.encode(this);

		return response;
	}
}

class RReadMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const file = FileService.getByFid(message.fid);

		if(!message.offset)
		{
			console.log('READ: ', message.fid, file.path);
		}

		const content = message.offset ? '' : String(file.path);

		const bytes   = [
			0, 0, 0, 0,
			packets.R_READ,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			... new Uint8Array(new Uint32Array([content.length]).buffer),
			... Buffer.from(content, 'utf-8'),
		];

		instance.content = content;

		instance.size = bytes[0] = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = packets.R_READ;
		instance.TYPE = 'R_READ';
		instance.tag  = message.tag;

		return instance;
	}
}

class TClunkMessage extends TMessage
{
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

		const response = RClunkMessage.encode(this);

		return response;
	}
}

class RClunkMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const bytes   = [
			0, 0, 0, 0,
			packets.R_CLUNK,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
		];

		instance.size = bytes[0] = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = packets.R_CLUNK;
		instance.TYPE = 'R_CLUNK';
		instance.tag  = message.tag;

		return instance;
	}
}

class TFlushMessage extends TMessage{}
class RFlushMessage extends RMessage{}

class RlErrorMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const bytes   = [
			0, 0, 0, 0,
			packets.R_LERROR,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			0x2, 0, 0, 0,
		];

		instance.size = bytes[0] = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = packets.R_LERROR;
		instance.TYPE = 'R_LERROR';
		instance.tag  = message.tag;

		return instance;
	}
}

class MessageFactory
{
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
				case packets.T_VERSION:
					messages.push( TVersionMessage.parse(current) );
					break;

				case packets.R_VERSION:
					messages.push( RVersionMessage.parse(current) );
					break;

				case packets.T_ATTACH:
					messages.push( TAttachMessage.parse(current) );
					break;

				case packets.R_ATTACH:
					messages.push( RAttachMessage.parse(current) );
					break;

				case packets.T_STAT:
					messages.push( TStatMessage.parse(current) );
					break;

				case packets.R_STAT:
					messages.push( RStatMessage.parse(current) );
					break;

				case packets.T_CLUNK:
					messages.push( TClunkMessage.parse(current) );
					break;

				case packets.R_CLUNK:
					messages.push( RClunkMessage.parse(current) );
					break;

				case packets.T_GETATTR:
					messages.push( TGetAttrMessage.parse(current) );
					break;

				case packets.R_GETATTR:
					messages.push( RGetAttrMessage.parse(current) );
					break;

				case packets.T_WALK:
					messages.push( TWalkMessage.parse(current) );
					break;

				case packets.R_WALK:
					messages.push( RWalkMessage.parse(current) );
					break;

				case packets.T_XATTRWALK:
					messages.push( TXAttrWalkMessage.parse(current) );
					break;

				case packets.T_LOPEN:
					messages.push( TlOpenMessage.parse(current) );
					break;

				case packets.R_LOPEN:
					messages.push( RlOpenMessage.parse(current) );
					break;

				case packets.T_READDIR:
					messages.push( TReadDirMessage.parse(current) );
					break;

				case packets.R_READDIR:
					messages.push( RReadDirMessage.parse(current) );
					break;

				case packets.T_READ:
					messages.push( TReadMessage.parse(current) );
					break;

				case packets.R_READ:
					messages.push( RReadMessage.parse(current) );
					break;

				case packets.T_STATFS:
					messages.push( TStatFsMessage.parse(current) );
					break;

				case packets.R_STATFS:
					messages.push( RStatFsMessage.parse(current) );
					break;

				case packets.T_FLUSH:
					messages.push( TFlushMessage.parse(current) );
					break;

				case packets.R_FLUSH:
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

module.exports = { MessageFactory, TFlushMessage };
