const { ROpenMessage } = require('./ROpenMessage');
const { TMessage }     = require('./TMessage');

class TOpenMessage extends TMessage
{
	static responseType = ROpenMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);

		instance.fid    = instance.u32(7)
		instance.mode   = instance.u8(11)

		return instance;
	}
}

module.exports = { TOpenMessage };
