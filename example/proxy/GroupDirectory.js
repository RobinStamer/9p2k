const Directory   = require('../../fs/Directory').Directory;
const FileService = require('../../fs/FileService').FileService;
const File        = require('../../fs/File').File;
const ProxyFile   = require('./ProxyFile').ProxyFile;
const Group       = require('./Group').Group;
const fs          = require('fs');

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
			const mirrorDirs  = fs.readdirSync(this.realPath);
			const mirrorFiles = new Set;
			const children    = new Set;

			const ranker = f => {

				const time = f.path
				.replace(/.+\//, '')
				.replace(/\..+$/, '')
				.replace(/^(?:\D+_)+/, '')
				.replace(/(?:_+\D)+/, '')
				.replace(/_/, ' ')
				.replace(/^(\d{4})(\d{2})(\d{2}) (\d{2})(\d{2})(\d{2})\D*.*/, '$1-$2-$3 $4:$5:$6');

				const stamp = Date.parse(time);

				return stamp;
			};

			for(const mirrorName of mirrorDirs)
			{
				const mirrorPath = this.realPath + '/' + mirrorName + '/Camera';
				const files  = fs.readdirSync(mirrorPath);

				files.forEach(f => {
					mirrorFiles.add({path:mirrorPath, name:f, time:ranker({path:f}), source:mirrorName})
				});
			}

			let current = null;

			const groups = new Set;

			for(const {path, name, time, source} of [...mirrorFiles].sort((a,b) => a.time - b.time))
			{
				const filepath = path + '/' + name;
				const item = {source, path:filepath};

				if(!current)
				{
					current = new Group(ranker(item), 15*60*1000, ranker);
				}

				if(!current.addItem(item))
				{
					groups.add(current);

					current = new Group(ranker(item), 15*60*1000, ranker);

					current.addItem(item);
				}

				current && groups.add(current);
			}

			for(const group of groups)
			{
				const dirName   = String(new Date(group.start)).replace(/\s\(.+/, '');
				const directory = new Directory({name:dirName, exists:true, parent: this});

				group.items.forEach(({source, path}) => {
					const realPath = path;
					const file     = new ProxyFile({name:source + '-' + path.replace(/.+\//, ''), exists:true, parent: directory, realPath});
					const stat     = fs.lstatSync(realPath);
					file.size      = stat.size;
					directory.addChildren(file);
				});

				this.children.push(directory);
			}

			// for(const child of children)
			// {
			// 	this.children.push(child);
			// }

			this.populated = true;
		}

		return this.children;
	}
}

module.exports = { GroupDirectory };
