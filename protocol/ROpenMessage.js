const Constants       = require('../protocol/Constants');
const { FileService } = require('../fs/FileService');
const { QSession }    = require('../session/QSession');
const { RMessage }    = require('./RMessage');

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

module.exports = { ROpenMessage };
