const Constants    = require('./Constants');
const TMessage     = require('./TMessage').TMessage;
const RStatMessage = require('./RStatMessage').RStatMessage;

class TStatMessage extends TMessage
{
	static responseType = RStatMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid   = dataView.getUint32(7, true);

		return instance;
	}
}

module.exports = { TStatMessage };
