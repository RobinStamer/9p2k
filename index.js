const MessageService = require('./protocol/MessageService').MessageService;

const FileService = require('./fs/FileService').FileService
const Directory   = require('./fs/Directory').Directory
const File        = require('./fs/File').File
const Server      = require('./net/Server').Server;

const TimeDirectory = require('./example/clocks/TimeDirectory').TimeDirectory;
const TimeFile      = require('./example/clocks/TimeFile').TimeFile;

const ProxyDirectory = require('./example/proxy/ProxyDirectory').ProxyDirectory;
const GroupDirectory = require('./example/proxy/GroupDirectory').GroupDirectory;

const input  = new ProxyDirectory({name: 'input', exists: true, realPath: './cam/cam'});
const output = new GroupDirectory({name: 'output', exists: true, realPath: './cam/cam'});

const root = new Directory({path: '/', exists: true});
const time = new TimeDirectory({name: 'clocks', exists: true});

root.addChildren(input, output, time);

FileService.register(root);

Server.listen(564, () => console.log(`\nListening!`));
