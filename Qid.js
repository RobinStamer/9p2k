class Qid
{
	static initialPathId = 0;//0x500C5E;

	static for(pathIndex = 0x00, directory = false)
	{
		const stat    = this.prototype.constructor;

		const type    = directory ? 0x80 : 0x00;
		const version = 0x00;
		const pathId  = BigInt(pathIndex + stat.initialPathId);

		const bytes = [
			type                                                     // type
			, ... new Uint8Array(new Uint32Array([version]).buffer)  // qid version
			, ... new Uint8Array(new BigInt64Array([pathId]).buffer) // path id
		];

		return bytes;
	}
}

module.exports = { Qid };
