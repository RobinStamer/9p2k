const MessageService = require('./protocol/MessageService').MessageService;

const FileService = require('./fs/FileService').FileService
const Directory   = require('./fs/Directory').Directory
const Server      = require('./net/Server').Server;

const ProxyDirectory = require('./example/proxy/ProxyDirectory').ProxyDirectory;
const GroupDirectory = require('./example/proxy/GroupDirectory').GroupDirectory;
// const TimeDirectory = require('./example/clocks/TimeDirectory').TimeDirectory;

const root   = FileService.getByPath('/', Directory, {exists: true});
const input  = FileService.getByPath('/input', ProxyDirectory, {name: 'input', exists: true, realPath: './cam/cam'});
const output = FileService.getByPath('/output', GroupDirectory, {name: 'output', exists: true, realPath: './cam/cam'});

root.addChildren(input, output);

console.log(output);

Server.listen(564, () => console.log(`\nListening!`));
