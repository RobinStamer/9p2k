const MessageService = require('./Message').MessageService;

const FileService = require('./FileService').FileService
const Directory   = require('./Directory').Directory
const File        = require('./File').File
const Server      = require('./Server').Server;

process.stderr.write("\n");

class TimeFile extends File
{
	getContent()
	{
		const date = new Date;

		try
		{
			const formatter = new Intl.DateTimeFormat(
				'en-US', {
					timeZone: String(this.content ?? '').trim() || 'GMT'
					, timeStyle: 'full'
					, dateStyle: 'full'
					, hour12: false
				}
			);

			return formatter.format(date) + "\n";
		}
		catch(error)
		{
			return String(error) + "\n";;
		}
	}
}

class TimeDirectory extends Directory
{
	populated = false

	getChildren()
	{
		if(!this.populated)
		{
			this.children.push(
				new TimeDirectory({name:'more-clocks',parent:this,exists:true}),
				new TimeFile({name:'gmt',parent:this,exists:true,content:''}),
				new TimeFile({name:'new-york',parent:this,exists:true,content:'America/New_York'}),
				new TimeFile({name:'los-angeles',parent:this,exists:true,content:'America/New_York'}),
			);

			this.populated = true;
		}

		return this.children;
	}

	newFile(name, exists = true)
	{
		if(name[0] === '.')
		{
			return;
			//return super.newFile(name);
		}

		const file = new TimeFile({name,parent:this,exists});

		this.addChildren(file);

		return file;
	}
}


// const childB = new File({name:'something-else', content: 'LMAO!'});
// const childC = new File({name:'something-different'});
// const childD = new File({name:'something-completely-different'});

// const root = new Directory({path:'/'});

// root.addChildren(childA, childB, list);
// list.addChildren(childC, childD);

FileService.register(new TimeDirectory({path: '/', exists: true}));

Server.listen(564, () => console.log(`Listening!`));

// const names = new Set(rootChildren.map(c => c.name));
// MessageService.target.addEventListener('list', event => {
// 	if(event.detail.directory !== '/')
// 	{
// 		return;
// 	}
// 	event.override(rootChildren);
// });
// MessageService.target.addEventListener('walk', event => {
// 	if(event.detail.directory !== '/')
// 	{
// 		return;
// 	}
// 	if(!names.has(event.detail.file))
// 	{
// 		return
// 	}
// 	process.stderr.write(`\u001b[35m(event hooked!)\u001b[39m `);
// 	event.override(true);
// });
