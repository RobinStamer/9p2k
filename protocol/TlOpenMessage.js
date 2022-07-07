const { RlOpenMessage } = require('./RlOpenMessage');
const { TMessage }      = require('./TMessage');

class TlOpenMessage extends TMessage
{
	static parse(blob)
	{
		const instance = super.parse(blob);

		instance.fid   = instance.u32(7)
		instance.mode  = blob.slice(11, 11 + 4);

		return instance;
	}

	response()
	{
		const file = FileService.getByFid(this.fid);

		if(file)
		{
			const response = RlOpenMessage.encode(this);

			return response;
		}

		return super.response();
	}
}

module.exports = { TlOpenMessage };
