const RWStatMessage = require('./RWStatMessage').RWStatMessage;
const TMessage      = require('./TMessage').TMessage;

class TWStatMessage extends TMessage
{
	static responseType = RWStatMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);

		instance.fid   = instance.u32(7)

		return instance;
	}
}

module.exports = { TWStatMessage }
