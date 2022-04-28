const Constants       = require('./Constants');
const TMessage        = require('./TMessage').TMessage;
const RGetAttrMessage = require('./RGetAttrMessage').RGetAttrMessage;

class TGetAttrMessage extends TMessage
{
	static responseType = RGetAttrMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid   = dataView.getUint32(7, true);

		return instance;
	}
}

module.exports = { TGetAttrMessage };
