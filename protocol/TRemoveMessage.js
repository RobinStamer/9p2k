const Constants          = require('./Constants');
const { TMessage }       = require('./TMessage');
const { RRemoveMessage } = require('./RRemoveMessage');

class TRemoveMessage extends TMessage
{
	static responseType = RRemoveMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid   = dataView.getUint32(7, true);

		return instance;
	}
}

module.exports = { TRemoveMessage };
