const Message = require('./Message').Message;

class RMessage extends Message
{
	tag;

	static parse(blob)
	{
		const instance = super.parse(blob);

		instance.tag   = instance.u16(5)

		return instance;
	}
}

module.exports = { RMessage };
