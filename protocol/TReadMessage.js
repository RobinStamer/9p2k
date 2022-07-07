const { RReadMessage } = require('./RReadMessage');
const { TMessage }     = require('./TMessage');

class TReadMessage extends TMessage
{
	static responseType = RReadMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);

		instance.fid    = instance.u32(7)
		instance.offset = instance.i64(11)
		instance.count  = instance.u32(19)

		return instance;
	}
}

module.exports = { TReadMessage };
