const { ROpenMessage } = require('./ROpenMessage');
const { TMessage }     = require('./TMessage');

class TOpenMessage extends TMessage
{
	static responseType = ROpenMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.mode   = dataView.getUint8(11, true);

		return instance;
	}
}

module.exports = { TOpenMessage };
