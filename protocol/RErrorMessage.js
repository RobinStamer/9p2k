const RMessage  = require('./RMessage').RMessage;
const Constants = require('../protocol/Constants');

class RErrorMessage extends RMessage
{
	version;

	static encode(tMessage)
	{
		const bytes = [
			0, 0, 0, 0,
			Constants.R_ERROR,
			... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
			... new Uint8Array(new Uint16Array([0]).buffer),
		];

		bytes[0] = bytes.length;

		const instance = new this.prototype.constructor;

		instance.blob = Buffer.from(new Uint8Array(bytes));

		return instance;
	}
}

module.exports = { RErrorMessage };
