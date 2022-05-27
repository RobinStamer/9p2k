const { RXAttrWalkMessage } = require('./RXAttrWalkMessage');
const { TMessage }          = require('./TMessage');

class TXAttrWalkMessage extends TMessage
{
	static responseType = RXAttrWalkMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.newFid = dataView.getUint32(11, true);
		instance.wName  = String( NString.decode(blob, 15) );

		return instance;
	}
}

module.exports = { TXAttrWalkMessage };
