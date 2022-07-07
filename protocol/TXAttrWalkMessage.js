const { RXAttrWalkMessage } = require('./RXAttrWalkMessage');
const { TMessage }          = require('./TMessage');

class TXAttrWalkMessage extends TMessage
{
	static responseType = RXAttrWalkMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);

		instance.fid    = instance.u32(7)
		instance.newFid = instance.u32(11)
		instance.wName  = String( NString.decode(blob, 15) );

		return instance;
	}
}

module.exports = { TXAttrWalkMessage };
