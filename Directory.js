const File = require('./File').File;

class Directory extends File
{
	mode      = 0o775;
	directory = true;
	children  = [];

	constructor(props = {})
	{
		super(props);

		for(const prop of Object.getOwnPropertyNames(this))
		{
			this[prop] = props[prop] ?? this[prop];
		}
	}

	canWalkTo(name)
	{
		const names = new Set(this.getChildren().map(c => c.name));

		return names.has(name);
	}

	getChildren()
	{
		return this.children;
	}

	addChildren(...children)
	{
		children.forEach(c => c.parent = this);

		this.children.push(...children);
	}
}

module.exports = { Directory };
