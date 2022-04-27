const Constants   = require('../protocol/Constants');

class Message
{
	blob;
	size;
	TYPE;
	type;

	static parse(blob)
	{
		const instance = new this.prototype.constructor;
		const dataView = new DataView(new Uint8Array([...blob]).buffer);

		instance.view  = dataView;

		instance.size  = dataView.getUint32(0, true);
		instance.type  = dataView.getUint8(4, true);

		for(const packetType in Constants)
		{
			if(instance.type === Constants[packetType])
			{
				instance.TYPE = packetType;
			}
		}

		instance.blob = blob;

		return instance;
	}

	encode(message){}

	toString()
	{
		return this.blob.toString();
	}
}

module.exports = { Message };
