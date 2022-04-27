class NString
{
	length = 0;
	value  = '';

	static decode(bytes, offset = 0)
	{
		const instance = new this.prototype.constructor;
		const dataView = new DataView(new Uint8Array(bytes).buffer);

		instance.length = dataView.getUint16(offset, true);

		instance.value  = bytes.slice(2 + offset, 2 + offset + instance.length).toString();

		return instance;
	}

	static encode(string)
	{
		return [
			... new Uint8Array(new Uint16Array([string.length]).buffer),
			... Buffer.from(string, 'utf-8'),
		];
	}

	toString()
	{
		return this.value;
	}
}

module.exports = { NString };
