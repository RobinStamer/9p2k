const Constants         = require('../protocol/Constants');
const { RClunkMessage } = require('./RClunkMessage');
const { FileService }   = require('../fs/FileService');
const { TMessage }      = require('./TMessage');

class TClunkMessage extends TMessage
{
	static responseType = RClunkMessage;

	static parse(blob)
	{
		const instance = super.parse(blob);
		const dataView = instance.view;

		instance.fid   = dataView.getUint32(7, true);

		return instance;
	}

	response()
	{
		FileService.forgetFid(this.fid);

		return super.response();
	}
}

module.exports = { TClunkMessage };
