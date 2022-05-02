const { FileService } = require('../fs/FileService');
const { Constants }   = require('./Constants');
const { RMessage }    = require('./RMessage');
const { QSession }    = require('../session/QSession');

class RSetAttrMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;
		const file = FileService.getByFid(message.fid);

		const qid  = QSession.getQid(file);

		file.aTime = 0;
		file.size  = file.directory ? 0 : 10;

		const bytes   = [
			0, 0, 0, 0,
			Constants.R_SETATTR,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
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

module.exports = { RSetAttrMessage };
