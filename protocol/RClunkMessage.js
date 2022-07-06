const Constants    = require('../protocol/Constants');
const { RMessage } = require('./RMessage');

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

module.exports = { RClunkMessage };
