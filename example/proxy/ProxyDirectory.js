const FileService = require('../../fs/FileService').FileService;
const Directory   = require('../../fs/Directory').Directory;
const ProxyFile   = require('./ProxyFile').ProxyFile;
const fs = require('fs');

class ProxyDirectory extends Directory
{
	populated = false
	realPath  = null;
	mode      = 0o777;

	constructor(props = {})
	{
		super(props);

		this.realPath = props.realPath;

		this.getChildren();
	}

	getChildren()
	{
		if(this.populated && Date.now() - this.populated > 5000)
		{
			this.populated = false;
		}

		if(!this.populated)
		{
			if(!fs.existsSync(this.realPath))
			{
				this.exists = false;
				return [];
			}

			const files = fs.readdirSync(this.realPath);

			files.forEach(name => {
				const realPath = this.realPath + '/' + name;
				const stat  = fs.lstatSync(realPath);

				const props = {
					size:    stat.size,
					parent:  this,
					exists:  true,
					content: name,
					realPath,
					name,
				};

				if(stat.isDirectory())
				{
					const file = FileService.getByPath(this.fullPath(name), ProxyDirectory, props);

					this.children.add(file);

					return;
				}

				const file = FileService.getByPath(this.fullPath(name), ProxyFile, props);

				this.children.add(file);
			});

			if(files.length)
			{
			}

			this.populated = Date.now();
		}

		return [...this.children];
	}

	newFile(name, exists = true)
	{
		return;
		// if(name[0] === '.')
		// {
		// 	return;
		// }

		// const path = this.fullPath(name);

		// const file = FileService.getByPath(path, ProxyFile, {name, exists, parent:this});

		// this.addChildren(file);

		// return file;
	}
}

module.exports = { ProxyDirectory };
