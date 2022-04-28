class File
{
	root    = false
	path    = '';
	name    = '';
	size    = 0;
	mode    = 0o755;
	uid     = 1000;
	gid     = 1000;
	parent  = null;
	exists  = true;
	content = undefined;

	constructor(props = {})
	{
		for(const prop of Object.getOwnPropertyNames(this))
		{
			this[prop] = props[prop] ?? this[prop];
		}

		if(this.path === '/')
		{
			this.root = true;
		}
		else if(this.path)
		{
			this.name = String(this.path).split('/').pop();
		}
	}

	fullPath(childName = null)
	{
		if(childName === null)
		{
			if(this.parent)
			{
				return (this.parent.path !== '/')
					? this.parent.fullPath() + '/' + this.name
					: '/' + this.name;
			}

			return '/';
		}

		if(this.parent)
		{
			return this.fullPath() + '/' + childName;
		}

		return '/' + childName;
	}

	setContent(content)
	{
		return this.content = Buffer.from(content, 'utf-8');
	}

	getContent()
	{
		return this.content
			? this.content.slice(offset, Number(offset) + Number(length))
			: Buffer.from(this.path + "\n");
	}
}

module.exports = { File };
