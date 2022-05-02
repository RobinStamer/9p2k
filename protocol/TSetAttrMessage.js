const { RSetAttrMessage } = require('./RSetAttrMessage');
const { TMessage } = require('./TMessage');

class TSetAttrMessage extends TMessage
{
	static responseType = RSetAttrMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
 		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.valid  = dataView.getUint32(11, true);
		instance.mode   = dataView.getUint32(15, true);
		instance.uid    = dataView.getUint32(19, true);
		instance.gid    = dataView.getUint32(23, true);
		instance.size   = dataView.getBigInt64(27, true);
		instance.aTime  = dataView.getBigInt64(31, true);
		instance.aTimeN = dataView.getBigInt64(33, true);
		instance.mTime  = dataView.getBigInt64(31, true);
		instance.mTimeN = dataView.getBigInt64(33, true);

		return instance;
	}
}

module.exports = { TSetAttrMessage };
