const MessageService = require('./Message').MessageService;

const FileService = require('./FileService').FileService
const Directory   = require('./Directory').Directory
const File        = require('./File').File
const Server      = require('./Server').Server;

process.stderr.write("\n");

class TimeFile extends File
{
	mode = 0o100555;

	getContent()
	{
		return String(new Date) + "\n";
	}
}

const childA = new TimeFile({name:'something'});
const childB = new File({name:'something-else', content: 'LMAO!'});
const childC = new File({name:'something-different'});
const childD = new File({name:'something-completely-different'});

const list = new Directory({name:'list-of-stuff'});
const root = new Directory({path:'/'});

root.addChildren(childA, childB, list);
list.addChildren(childC, childD);

FileService.register(root);

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
