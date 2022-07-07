const Constants    = require('./Constants');
const TMessage     = require('./TMessage').TMessage;
const RStatMessage = require('./RStatMessage').RStatMessage;

class TStatMessage extends TMessage
{
	static responseType = RStatMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);

		instance.fid   = instance.u32(7)

		return instance;
	}
}

module.exports = { TStatMessage };
