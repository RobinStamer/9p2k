const { RStatFsMessage } = require('./RStatFsMessage');
const { TMessage }       = require('./TMessage');

class TStatFsMessage extends TMessage
{
	static responseType = RStatFsMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);

		instance.fid    = instance.u32(7)

		return instance;
	}
}

module.exports = { TStatFsMessage };
