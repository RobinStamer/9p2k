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
	}

	getChildren()
	{
		if(this.populated && Date.now() - this.populated > 5000)
		{
			this.populated = false;
			this.children  = [];
		}

		if(!this.populated)
		{
			const files = fs.readdirSync(this.realPath);

			this.children.push(...files.map(name => {
				const realPath = this.realPath + '/' +name;
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
					return FileService.getByPath(this.fullPath(name), ProxyDirectory, props);
				}

				return FileService.getByPath(this.fullPath(name), ProxyFile, props);
			}));

			this.populated = true;
		}

		return this.children;
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
