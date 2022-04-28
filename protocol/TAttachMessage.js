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
		const dataView = instance.view;

		instance.fid   = dataView.getUint32(7, true);
		instance.afid  = dataView.getUint32(11, true);

		instance.uName = String( NString.decode(blob, 15) );
		instance.aName = String( NString.decode(blob, 17 + instance.uName.length) );

		return instance;
	}
}

module.exports = { TAttachMessage };
