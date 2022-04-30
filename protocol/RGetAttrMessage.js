const FileService = require('../fs/FileService').FileService;
const Constants   = require('../protocol/Constants');
const RMessage    = require('./RMessage').RMessage;

class RGetAttrMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;
		const file = FileService.getByFid(message.fid);

		const qid  = QSession.getQid(file);

		file.size  = file.directory ? 0 : 10;

		const mode = (file.mode << 0) + (file.directory ? 0o040000 : 0);

		const bytes   = [
			0, 0, 0, 0,
			Constants.R_GETATTR,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			... new Uint8Array(new Uint32Array([0x3FFF, 0x0]).buffer),
			... qid,
			... new Uint8Array(new Uint32Array([mode]).buffer),             // mode
			... new Uint8Array(new Uint32Array([file.uid ?? 1000]).buffer), // uid
			... new Uint8Array(new Uint32Array([file.gid ?? 1000]).buffer), // gid
			... [1, 0, 0, 0, 0, 0, 0, 0],    // nlink
			... [0, 0, 0, 0, 0, 0, 0, 0],    // rdev
			... new Uint8Array(new BigUint64Array([BigInt(file.size ?? 0)]).buffer), // size
			... [0, 0x10, 0, 0, 0, 0, 0, 0], // blockSize
			... [0, 0, 0, 0, 0, 0, 0, 0],    // blocks
			... new Uint8Array(new BigUint64Array([BigInt(Math.trunc((file.aTime ?? Date.now() / 1000)))]).buffer), // aTime
			... [0, 0, 0, 0, 0, 0, 0, 0],    // aTimeNs
			... new Uint8Array(new BigUint64Array([BigInt(Math.trunc((file.mTime ?? Date.now() / 1000)))]).buffer), // mTime
			... [0, 0, 0, 0, 0, 0, 0, 0],    // mTimeNs
			... new Uint8Array(new BigUint64Array([BigInt(Math.trunc((file.cTime ?? Date.now() / 1000)))]).buffer), // cTime
			... [0, 0, 0, 0, 0, 0, 0, 0],    // cTimeNs
			... new Uint8Array(new BigUint64Array([BigInt(Math.trunc((file.bTime ?? Date.now() / 1000)))]).buffer), // bTime
			... [0, 0, 0, 0, 0, 0, 0, 0],    // bTimeNs
			... [0, 0, 0, 0, 0, 0, 0, 0],    // gen
			... [0, 0, 0, 0, 0, 0, 0, 0],    // dataversion
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		instance.size = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = Constants.R_GETATTR;
		instance.TYPE = 'R_GETATTR';
		instance.tag  = message.tag;

		return instance;
	}
}

module.exports = { RGetAttrMessage };
