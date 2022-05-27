const { RMessage } = require('./RMessage');

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

module.exports = { RlErrorMessage };
