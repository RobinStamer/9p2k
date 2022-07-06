const { RMessage } = require('./RMessage');

class RReadDirMessage extends RMessage
{
	static encode(tMessage)
	{
		const instance = new this.prototype.constructor;

		const entries = [0, 0, 0, 0];

		const parent = FileService.getByFid(tMessage.fid);

		if(!tMessage.offset)
		{
			let index = 0;

			const children = parent.getChildren().filter(c => c.exists);

			for(const file of children)
			{
				const name = file.name;

				const qid   = QSession.getQid(file);
				const entry = [
					...qid,
					0x04,
					... new Uint8Array(new BigUint64Array([BigInt(++index)]).buffer),
					... NString.encode(name)
				];

				entries.push(...entry);
			}

			Object.assign(entries, new Uint8Array(new Uint32Array([entries.length]).buffer));
		}

		const bytes = [
			0, 0, 0, 0,
			Constants.R_READDIR,
			... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
			... entries
		];

		instance.size = bytes.length;

		Object.assign(bytes, new Uint8Array(new Uint32Array([bytes.length]).buffer));

		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = Constants.R_READDIR;
		instance.TYPE = 'R_READDIR';
		instance.tag  = tMessage.tag;

		return instance;
	}
}

module.exports = { RReadDirMessage };
