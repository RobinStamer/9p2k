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

		instance.fid    = instance.u32(7)
		instance.newFid = instance.u32(11)
		instance.walks  = instance.u16(15)

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
