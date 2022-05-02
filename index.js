#!/usr/bin/env node

const { spawn } = require('child_process');

const { MessageService } = require('./protocol/MessageService');

const { FileService } = require('./fs/FileService');
const { Directory }   = require('./fs/Directory');
const { Server }      = require('./net/Server');

const { ProxyDirectory } = require('./example/proxy/ProxyDirectory');
const { GroupDirectory } = require('./example/proxy/GroupDirectory');

const [bin, script, sourceDir, address, port] = process.argv;

const root   = FileService.getByPath('/', Directory, {exists: true});
const input  = FileService.getByPath('/input', ProxyDirectory, {name: 'input', exists: true, realPath: sourceDir, parent:root});
const output = FileService.getByPath('/output', GroupDirectory, {name: 'output', exists: true, realPath: sourceDir, parent:root});

root.addChildren(input, output);

const iNotify = spawn('inotifywait', ['--format', '%e %w%f',  '-mre', 'moved_to,moved_from,create,delete', './cam/cam/']);

iNotify.stdout.on('data', data => {

	const [action, path] = data.toString().trim().split(' ');
	const dayDirectories = GroupDirectory.getMapping(path);

	dayDirectories && dayDirectories.forEach(d => {
		if(d.parent && d.parent.refreshContent)
		{
			console.log({action, path, d});
			d.parent.refreshContent();
		}
	});
});

iNotify.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

if(address && address[0] === '/')
{
	Server.listen(address, () => console.log(`\nListening!`));
}
else
{
	Server.listen(port ?? 564, address ?? '0.0.0.0', () => console.log(`\nListening!`));
}

