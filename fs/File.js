class File
{
	root    = false
	path    = '';
	name    = '';
	size    = 0;
	mode    = 0o777;
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

	fullPath()
	{
		if(this.parent)
		{
			return (this.parent.path !== '/')
				? this.parent.fullPath() + '/' + this.name
				: '/' + this.name;
		}

		return '/';
	}

	setContent(content)
	{
		return this.content = content;
	}

	getContent()
	{
		return this.content ?? (this.path + "\n");
	}
}

module.exports = { File };
