const { RMessage } = require('./RMessage');

class RXAttrWalkMessage extends RMessage
{
	static encode(message)
	{
		const instance = new this.prototype.constructor;

		const bytes = [
			0, 0, 0, 0,
			Constants.R_XATTRWALK,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			0x00, 0x00, 0x00, 0x00,  0x00, 0x00, 0x00, 0x00,
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		instance.size = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = Constants.R_XATTRWALK;
		instance.TYPE = 'R_XATTRWALK';
		instance.tag  = message.tag;

		return instance;
	}
}

module.exports = { RXAttrWalkMessage };
