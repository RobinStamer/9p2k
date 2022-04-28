const FileService = require('../fs/FileService').FileService;
const Constants   = require('../protocol/Constants');
const RMessage    = require('./RMessage').RMessage;

class RWStatMessage extends RMessage
{
	static encode(tMessage)
	{
		const rMessage = new this.prototype.constructor;

		const file = FileService.getByFid(tMessage.fid);

		file.exists = true;

		const bytes = [
			0, 0, 0, 0,
			Constants.R_WSTAT,
			... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		rMessage.size = bytes.length;
		rMessage.blob = Buffer.from(new Uint8Array(bytes));

		rMessage.type = Constants.R_WSTAT;
		rMessage.TYPE = 'R_WSTAT';
		rMessage.tag  = tMessage.tag;

		return rMessage;
	}
}

module.exports = { RWStatMessage };
