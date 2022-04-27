const File = require('../../fs/File').File;
const fs = require('fs');

class ProxyFile extends File
{
	realPath = null;
	mode     = 0o755;

	constructor(props = {})
	{
		super(props);

		this.realPath = props.realPath;
	}

	getContent(offset = 0, length = undefined)
	{
		if(!length)
		{
			const content = fs.readFileSync(this.realPath).slice(offset);

			return content;
		}
		else
		{
			const stat = fs.lstatSync(this.realPath);

			if(offset >= stat.size)
			{
				return new Uint8Array(0);
			}

			if(BigInt(offset) + BigInt(length) > BigInt(stat.size))
			{
				console.log(BigInt(offset), BigInt(length), BigInt(stat.size));

				length = (BigInt(offset) + BigInt(length)) - BigInt(stat.size);
			}

			const buffer = new Uint8Array(Number(length));
			const fd     = fs.openSync(this.realPath, 'r');

			fs.readSync(fd, buffer, 0, Number(length), offset)

			return buffer;
		}


	}
}

module.exports = { ProxyFile };
