const Constants         = require('../protocol/Constants');
const { RErrorMessage } = require('./RErrorMessage');
const { RMessage }      = require('./RMessage');
const { QSession }      = require('../session/QSession');

class RWalkMessage extends RMessage
{
	static encode(message)
	{
		if(!message.file)
		{
			return RErrorMessage.encode(message);
		}

		const instance = new this.prototype.constructor;
		const qid = QSession.getQid(message.file);

		const bytes   = [
			0, 0, 0, 0,
			Constants.R_WALK,
			... new Uint8Array(new Uint16Array([message.tag]).buffer),
			... new Uint8Array(new Uint16Array([(message.walks ? 1 : 0)]).buffer),
			... (message.walks ? qid : [])
		];

		Object.assign(bytes, new Uint8Array(new Uint16Array([bytes.length]).buffer));

		instance.size = bytes.length;
		instance.blob = Buffer.from(new Uint8Array(bytes));

		instance.type = Constants.R_WALK;
		instance.TYPE = 'R_WALK';
		instance.tag  = message.tag;

		return instance;
	}
}

module.exports = { RWalkMessage };
