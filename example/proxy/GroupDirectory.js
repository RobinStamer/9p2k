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

			let currentGroup = null;
			let currentDay = null;

			const groups = new Set;
			const days   = new Map;

			for(const {path, name, time, source} of [...mirrorFiles].sort((a,b) => a.time - b.time))
			{
				const filepath = path + '/' + name;
				const item = {source, path:filepath};

				if(!currentGroup)
				{
					currentGroup = new Group(ranker(item), 15*60*1000, ranker);
				}

				const [date, time] = currentGroup.getDate().split(', ');

				currentGroup.label = time;

				if(!days.has(date))
				{
					days.set(date, new Set);
				}

				currentDay = days.get(date);

				currentDay.add(currentGroup);
				groups.add(currentGroup);

				if(!currentGroup.addItem(item))
				{
					currentGroup = new Group(ranker(item), 15*60*1000, ranker);
					currentGroup.addItem(item);
				}
			}

			const groupDirs = new Map;

			for(const [label, groups] of days)
			{
				const dayDirectory = new Directory({name:label, exists:true, parent: this});

				// FileService.register(dayDirectory);

				for(const group of groups)
				{
					const date = new Date(group.start);

					if(!groupDirs.has(group))
					{
						const newDirectory = new Directory({name:group.label, exists:true, parent: dayDirectory});

						groupDirs.set(group, newDirectory);

						// FileService.register(newDirectory);
					}

					console.log( group );

					const groupDirectory = groupDirs.get(group);

					group.items.forEach(({source, path}) => {
						const realPath = path;
						const file     = new ProxyFile({
							name:source + '-' + path.replace(/.+\//, ''),
							parent: groupDirectory,
							exists:true,
							realPath
						});
						const stat     = fs.lstatSync(realPath);
						file.size      = stat.size;
						groupDirectory.addChildren(file);
						// FileService.register(file);
					});

					dayDirectory.children.push(groupDirectory);
				}

				this.children.push(dayDirectory);
			}


			this.populated = true;
		}

		return this.children;
	}
}

module.exports = { GroupDirectory };
