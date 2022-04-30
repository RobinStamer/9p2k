const Directory   = require('../../fs/Directory').Directory;
const FileService = require('../../fs/FileService').FileService;
const File        = require('../../fs/File').File;
const ProxyFile   = require('./ProxyFile').ProxyFile;
const Group       = require('./Group').Group;
const fs          = require('fs');

class GroupDirectory extends Directory
{
	populated = false;
	realPath  = null;
	mode      = 0o555;

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
		}

		if(!this.populated)
		{
			const mirrorDirs  = fs.readdirSync(this.realPath);
			const mirrorFiles = new Set;
			const children    = new Set;

			const ranker = f => {
				const time = f.path
				.replace(/.+\//, '')
				.replace(/.*(\d{8}_\d{6}).*/, '$1')
				.replace(/^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');

				return Date.parse(time);
			};

			for(const mirrorName of mirrorDirs)
			{
				let mirrorPath = this.realPath + '/' + mirrorName;

				if(fs.existsSync(mirrorPath + '/Camera'))
				{
					mirrorPath += '/Camera';
				}

				fs.readdirSync(mirrorPath).forEach(f => {
					const time = ranker({path:f});
					if(isNaN(time))
					{
						return;
					}
					mirrorFiles.add({path:mirrorPath, name:f, time, source:mirrorName})
				});
			}

			let currentGroup = null;
			let currentDay = null;

			const days   = new Map;

			for(const {path, name, time, source} of [...mirrorFiles].sort((a,b) => a.time - b.time))
			{
				const filepath = path + '/' + name;
				const item = {source, path:filepath};
				const rank = ranker(item);

				if(isNaN(rank))
				{
					continue;
				}

				if(!currentGroup)
				{
					currentGroup = new Group(rank, 15*60*1000, ranker);
				}

				if(!currentGroup.addItem(item))
				{
					currentGroup = new Group(rank, 15*60*1000, ranker);
					currentGroup.addItem(item);
				}

				const [date, time] = currentGroup.getDate().split(', ');

				currentGroup.label = time.replace(':', '.');

				if(!days.has(date))
				{
					days.set(date, new Set);
				}

				currentDay = days.get(date);

				currentDay.add(currentGroup);

			}

			const groupDirs = new Map;

			for(const [label, groups] of days)
			{
				const dayDirectory = FileService.getByPath(this.fullPath(label), Directory, {name:label, exists:true, parent: this});

				for(const group of groups)
				{
					if(!groupDirs.has(group))
					{
						const newDirectory = FileService.getByPath(
							dayDirectory.fullPath(group.label),
							Directory,
							{name:group.label, exists:true, parent: dayDirectory}
						);

						groupDirs.set(group, newDirectory);
					}

					const groupDirectory = groupDirs.get(group);

					group.items.forEach(({source, path}) => {
						const name = source + '-' + path.replace(/.+\//, '');
						const file = FileService.getByPath(groupDirectory.fullPath(name), ProxyFile, {
							parent:   groupDirectory,
							realPath: path,
							exists:   true,
							name,
						});
						const stat = fs.lstatSync(path);
						file.size  = stat.size;
						groupDirectory.addChildren(file);
					});

					dayDirectory.children.push(groupDirectory);
				}

				this.children.push(dayDirectory);
			}

			this.populated = Date.now();
		}

		return this.children;
	}
}

module.exports = { GroupDirectory };
