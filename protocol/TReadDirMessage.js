const { RReadDirMessage } = require('./RReadDirMessage');
const { TMessage }        = require('./TMessage');

class TReadDirMessage extends TMessage
{
	static responseType = RReadDirMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.offset = dataView.getBigInt64(9, true);
		instance.count  = dataView.getUint32(13, true);

		return instance;
	}
}

module.exports = { TReadDirMessage };
