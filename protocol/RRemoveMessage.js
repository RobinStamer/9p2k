const FileService = require('../fs/FileService').FileService;
const Constants   = require('../protocol/Constants');
const RMessage    = require('./RMessage').RMessage;

class RRemoveMessage extends RMessage
{
	static encode(tMessage)
	{
		const rMessage = new this.prototype.constructor;

		const file = FileService.getByFid(tMessage.fid);

		file.exists = false;

		const bytes = [
			0, 0, 0, 0,
			Constants.R_REMOVE,
			... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		rMessage.size = bytes.length;
		rMessage.blob = Buffer.from(new Uint8Array(bytes));

		rMessage.type = Constants.R_REMOVE;
		rMessage.TYPE = 'R_REMOVE';
		rMessage.tag  = tMessage.tag;

		return rMessage;
	}
}

module.exports = { RRemoveMessage };
