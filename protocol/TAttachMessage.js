const RAttachMessage = require('./RAttachMessage').RAttachMessage;
const FileService    = require('../fs/FileService').FileService;
const TMessage       = require('./TMessage').TMessage;
const NString        = require('../protocol/NString').NString;

class TAttachMessage extends TMessage
{
	static responseType = RAttachMessage;

	fid;
	afid;
	aName;

	static parse(blob)
	{
		const instance = super.parse(blob);

		instance.fid   = instance.u32(7)
		instance.afid  = instance.u32(11)

		instance.uName = String( NString.decode(blob, 15) );
		instance.aName = String( NString.decode(blob, 17 + instance.uName.length) );

		return instance;
	}
}

module.exports = { TAttachMessage };
