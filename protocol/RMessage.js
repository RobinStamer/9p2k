const Message = require('./Message').Message;

class RMessage extends Message
{
	tag;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.tag   = dataView.getUint16(5, true);

		return instance;
	}
}

module.exports = { RMessage };
