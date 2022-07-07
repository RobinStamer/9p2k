const Constants          = require('./Constants');
const { TMessage }       = require('./TMessage');
const { RRemoveMessage } = require('./RRemoveMessage');

class TRemoveMessage extends TMessage
{
	static responseType = RRemoveMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);

		instance.fid   = instance.u32(7)

		return instance;
	}
}

module.exports = { TRemoveMessage };
