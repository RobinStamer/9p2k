const FileService = require('../fs/FileService').FileService;
const Constants   = require('./Constants');
const RMessage    = require('./RMessage').RMessage;
const QSession    = require('../session/QSession').QSession;
const Event       = require('../events/Event').Event;

class RAttachMessage extends RMessage
{
	static encode(tMessage)
	{
		const file = FileService.getByPath('/');
		const qid  = QSession.getQid(file);

		FileService.assignFid(tMessage.fid, file);

		const instance = new this.prototype.constructor;

		const attachEvent = new Event('attach', {cancelable: true, detail: {file, tMessage}});

		process.stderr.write(`\u001b[34m ATCH: ${tMessage.tag} ${tMessage.fid} ${file.path}\u001b[39m\n`);

		const bytes = [
			0, 0, 0, 0,
			Constants.R_ATTACH,
			... new Uint8Array(new Uint16Array([tMessage.tag]).buffer),
			... qid,
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		instance.size = bytes.length;

		instance.blob = Buffer.from(new Uint8Array(bytes));
		instance.type = Constants.R_ATTACH;
		instance.TYPE = 'R_ATTACH';
		instance.tag  = tMessage.tag;

		return instance;
	}
}

module.exports = { RAttachMessage };
