const { FileService } = require('../fs/FileService')
const Constants = require('../protocol/Constants')
const { RMessage } = require('./RMessage');

class RWriteMessage extends RMessage
{
	static encode(tMessage)
	{
		const file = FileService.getByFid(tMessage.fid);

		process.stderr.write(`\u001b[35mWRITE: ${tMessage.tag} ${tMessage.fid} ${file.path}\u001b[39m \n`);

		const bytes = [
			0, 0, 0, 0,
			Constants.R_WRITE,
			... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
			... new Uint8Array(new Uint32Array([tMessage.count]).buffer)
		];

		file.setContent(String(tMessage.data) || tMessage.data);

		const rMessage = new this.prototype.constructor;

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		rMessage.size = bytes.length;
		rMessage.blob = Buffer.from(new Uint8Array(bytes));

		rMessage.type = Constants.R_WRITE;
		rMessage.TYPE = 'R_WRITE';
		rMessage.tag  = tMessage.tag;

		return rMessage;
	}
}

module.exports = { RWriteMessage };
