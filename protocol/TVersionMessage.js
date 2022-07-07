const NString  = require('../protocol/NString').NString;
const TMessage = require('./TMessage').TMessage;
const RVersionMessage = require('./RVersionMessage').RVersionMessage;

class TVersionMessage extends TMessage
{
	static responseType = RVersionMessage;

	version;

	static parse(blob)
	{
		const instance = super.parse(blob);

		instance.version = String( NString.decode(blob, 11) );

		return instance;
	}

	response()
	{
		// const blob = Buffer.alloc(this.blob.length);

		// this.blob.copy(blob);

		// const dataView = new DataView(blob.buffer);

		// dataView.setUint8(4, Constants.R_VERSION, true);

		return RVersionMessage.encode(this);
	}
}

module.exports = { TVersionMessage };
