const { RStatFsMessage } = require('./RStatFsMessage');
const { TMessage }       = require('./TMessage');

class TStatFsMessage extends TMessage
{
	static responseType = RStatFsMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);

		return instance;
	}
}

module.exports = { TStatFsMessage };
