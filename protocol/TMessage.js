const Message = require('./Message').Message;
const RMessage = require('./RMessage').RMessage;

class TMessage extends Message
{
	static responseType = RMessage;

	tag;

	static parse(blob)
	{
		const instance = super.parse(blob);

		instance.tag   = instance.u16(5)

		return instance;
	}

	response()
	{
		return this.constructor.responseType.encode(this);
	}
}

module.exports = { TMessage };
