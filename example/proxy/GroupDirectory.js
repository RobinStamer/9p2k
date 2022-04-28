const Directory = require('../../fs/Directory').Directory;
const File      = require('../../fs/File').File;
const ProxyFile = require('./ProxyFile').ProxyFile;
const Group     = require('./Group').Group;
const fs        = require('fs');

class GroupDirectory extends Directory
{
	populated = false
	realPath  = null;
	mode      = 0o555;

	constructor(props = {})
	{
		super(props);

		this.realPath = props.realPath;
	}

	getChildren()
	{
		if(!this.populated)
		{
			const files  = fs.readdirSync(this.realPath);
			const groups = new Set;

			let current = null;

			for(const file of files)
			{
				const ranker = f => {
					const time = f.replace(/\..+$/, '')
						.replace(/^(?:\D+_)+/, '')
						.replace(/(?:_+\D)+/, '')
						.replace(/_/, ' ')
						.replace(/^(\d{4})(\d{2})(\d{2}) (\d{2})(\d{2})(\d{2})\D*.*/, '$1-$2-$3 $4:$5:$6');
					const stamp = Date.parse(time);

					return stamp;
				};

				if(!current)
				{
					current = new Group(ranker(file), 15*60*1000, ranker);
				}

				if(!current.addItem(file))
				{
					groups.add(current);

					current = new Group(ranker(file), 15*60*1000, ranker);

					current.addItem(file);
				}
			}

			groups.add(current);

			this.children.push(...[...groups].map(
				group => {
					const dirName   = String(new Date(group.start)).replace(/\s\(.+/, '');
					const directory = new Directory({name:dirName, exists:true, parent: this});

					group.items.forEach(item => {
						console.log(group.start, item);
						const realPath = this.realPath + '/' + item;
						const file     = new ProxyFile({name: item, parent: directory, realPath});
						const stat     = fs.lstatSync(realPath);
						file.size      = stat.size;
						directory.addChildren(file);
					});

					return directory;
				}
			));

			this.populated = true;
		}

		return this.children;
	}
}

module.exports = { GroupDirectory };
