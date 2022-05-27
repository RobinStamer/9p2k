const { RWriteMessage } = require('./RWriteMessage');
const { TMessage }      = require('./TMessage');

class TWriteMessage extends TMessage
{
	static responseType = RWriteMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.offset = dataView.getBigInt64(11, true);
		instance.count  = dataView.getUint32(19, true);
		instance.data   = blob.slice(23);

		return instance;
	}
}

module.exports = { TWriteMessage };
