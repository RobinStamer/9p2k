const Directory = require('../../fs/Directory').Directory;
const ProxyFile = require('./ProxyFile').ProxyFile;
const fs = require('fs');

class ProxyDirectory extends Directory
{
	populated = false
	realPath  = null;
	mode      = 0o755;

	constructor(props = {})
	{
		super(props);

		this.realPath = props.realPath;
	}

	getChildren()
	{
		if(!this.populated)
		{
			const files = fs.readdirSync(this.realPath);

			this.children.push(...files.map(name => {
				const realPath = this.realPath + '/' +name;
				const stat  = fs.lstatSync(realPath);
				const props = {
					name,
					parent:this,
					exists:true,
					content:name,
					realPath,
					size: stat.size
				};

				if(stat.isDirectory())
				{
					return new ProxyDirectory(props);
				}

				return new ProxyFile(props)
			}));

			this.populated = true;
		}

		return this.children;
	}

	newFile(name, exists = true)
	{
		if(name[0] === '.')
		{
			return;
		}

		const file = new ProxyFile({name,parent:this,exists});

		this.addChildren(file);

		return file;
	}
}

module.exports = { ProxyDirectory };
