const RWStatMessage = require('./RWStatMessage').RWStatMessage;
const TMessage      = require('./TMessage').TMessage;

class TWStatMessage extends TMessage
{
	static responseType = RWStatMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid   = dataView.getUint32(7, true);

		return instance;
	}
}

