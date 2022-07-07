const Constants   = require('../protocol/Constants');

class Message {
	blob;
	size;
	TYPE;
	type;

	static parse(blob) {
		const instance = new this.prototype.constructor;
		
		instance.blob = blob;

		instance.size  = instance.u32(0)
		instance.type  = instance.u8(4)

		for(const packetType in Constants)
		{
			if(instance.type === Constants[packetType])
			{
				instance.TYPE = packetType;
			}
		}

		return instance;
	}

	encode(message){}

	toString()
	{
		return this.blob.toString();
	}

	u8(i) {
		return this.blob.readUint8(i || 0)
	}

	u16(i) {
		return this.blob.readUint16LE(i || 0)
	}

	u32(i) {
		return this.blob.readUint32LE(i || 0)
	}

	i64(i) {
		return this.blob.readBigInt64LE(i || 0)
	}
}

module.exports = { Message };
