const RMessage  = require('./RMessage').RMessage;
const NString   = require('../protocol/NString').NString;
const Constants = require('../protocol/Constants');

class RVersionMessage extends RMessage
{
	version;

	static encode(tMessage)
	{
		const bytes = [
			0, 0, 0, 0,
			Constants.R_VERSION,
			... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
			... new Uint8Array(new Uint32Array([8192]).buffer),
			... NString.encode('9P2000')
		];

		bytes[0] = bytes.length;

		const instance = new this.prototype.constructor;

		instance.blob = Buffer.from(new Uint8Array(bytes));

		return instance;
	}
}

module.exports = { RVersionMessage };
