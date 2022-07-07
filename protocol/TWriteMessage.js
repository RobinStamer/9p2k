const { RWriteMessage } = require('./RWriteMessage');
const { TMessage }      = require('./TMessage');

class TWriteMessage extends TMessage
{
	static responseType = RWriteMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);

		instance.fid    = instance.u32(7)
		instance.offset = instance.i64(11)
		instance.count  = instance.u32(19)
		instance.data   = blob.slice(23);

		return instance;
	}
}

module.exports = { TWriteMessage };
