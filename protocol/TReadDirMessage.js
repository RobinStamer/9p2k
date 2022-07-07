const { RReadDirMessage } = require('./RReadDirMessage');
const { TMessage }        = require('./TMessage');

class TReadDirMessage extends TMessage
{
	static responseType = RReadDirMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);

		instance.fid    = instance.u32(7)
		instance.offset = instance.i64(9)
		instance.count  = instance.u32(13)

		return instance;
	}
}

module.exports = { TReadDirMessage };
