const Constants       = require('./Constants');
const TMessage        = require('./TMessage').TMessage;
const RGetAttrMessage = require('./RGetAttrMessage').RGetAttrMessage;

class TGetAttrMessage extends TMessage
{
	static responseType = RGetAttrMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);

		instance.fid   = instance.u32(7)

		return instance;
	}
}

module.exports = { TGetAttrMessage };
