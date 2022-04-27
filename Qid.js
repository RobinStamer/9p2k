class Qid
{
	static initialPathId = 100;//0x500C5E;

	static for(pathIndex = 100, directory = false)
	{
		const stat    = this.prototype.constructor;

		const type    = directory ? 0x80 : 0x00;
		const version = 100;
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
