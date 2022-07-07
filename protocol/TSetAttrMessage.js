const { RSetAttrMessage } = require('./RSetAttrMessage');
const { TMessage } = require('./TMessage');

class TSetAttrMessage extends TMessage
{
	static responseType = RSetAttrMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);

		instance.fid    = instance.u32(7)
		instance.valid  = instance.u32(11)
		instance.mode   = instance.u32(15)
		instance.uid    = instance.u32(19)
		instance.gid    = instance.u32(23)
		instance.size   = instance.i64(27)
		instance.aTime  = instance.i64(31)
		instance.aTimeN = instance.i64(33)
		instance.mTime  = instance.i64(31)
		instance.mTimeN = instance.i64(33)

		return instance;
	}
}

module.exports = { TSetAttrMessage };
