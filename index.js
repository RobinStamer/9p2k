const MessageService = require('./protocol/Message').MessageService;

const FileService = require('./fs/FileService').FileService
const Directory   = require('./fs/Directory').Directory
const File        = require('./fs/File').File
const Server      = require('./net/Server').Server;

const TimeDirectory = require('./example/clocks/TimeDirectory').Server;
const TimeFile    = require('./example/clocks/TimeFile').Server;

process.stderr.write("\n");

FileService.register(new TimeDirectory({path: '/', exists: true}));

Server.listen(564, () => console.log(`Listening!`));

// const childB = new File({name:'something-else', content: 'LMAO!'});
// const childC = new File({name:'something-different'});
// const childD = new File({name:'something-completely-different'});

// const root = new Directory({path:'/'});

// root.addChildren(childA, childB, list);
// list.addChildren(childC, childD);


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
