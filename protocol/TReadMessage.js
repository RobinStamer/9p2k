const { RReadMessage } = require('./RReadMessage');
const { TMessage }     = require('./TMessage');

class TReadMessage extends TMessage
{
	static responseType = RReadMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.offset = dataView.getBigInt64(11, true);
		instance.count  = dataView.getUint32(19, true);

		return instance;
	}
}

module.exports = { TReadMessage };
