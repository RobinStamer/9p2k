const { RErrorMessage } = require('./RErrorMessage');
const { RWalkMessage }  = require('./RWalkMessage');
const { FileService }   = require('../fs/FileService');
const { TMessage }      = require('./TMessage');
const { NString }       = require('./NString');

class TWalkMessage extends TMessage
{
	static responseType = RWalkMessage;

	static parse(blob)
	{
		const instance  = super.parse(blob);
		const dataView  = instance.view;

		instance.fid    = dataView.getUint32(7, true);
		instance.newFid = dataView.getUint32(11, true);
		instance.walks  = dataView.getUint16(15, true);

		if(instance.walks)
		{
			instance.wName = String( NString.decode(blob, 17) );
		}

		return instance;
	}

	response()
	{
		if(String(this.wName).match(/^\.+\/*$/) || String(this.wName).match(/\//))
		{
			return RErrorMessage.encode(tMessage);
		}

		const parent = this.file = FileService.getByFid(this.fid);
		const wName  = this.wName ?? '';

		if(!this.walks)
		{
			if(this.file)
			{
				FileService.assignFid(this.newFid, this.file);
			}

			return RWalkMessage.encode(this);
		}

		process.stderr.write(`\u001b[34m WALK: ${this.tag} ${this.fid} ${parent.fullPath()} ${wName}\u001b[39m\n`);

		const fullPath = parent.path === '/'
			? '/' + wName
			: parent.fullPath() + '/' + wName;

		this.file = FileService.getByPath(fullPath, false);

		FileService.assignFid(this.newFid, this.file);

		return super.response();
	}
}

module.exports = { TWalkMessage };
