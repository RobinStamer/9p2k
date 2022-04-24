const MessageService = require('./Message').MessageService;
const net = require('net');

process.stderr.write("\n");

const server = net.createServer(c => {

	c.on('end', () => console.log('server disconnected!'));

	c.on('data', blob => {
		const messages = MessageService.parse(blob);

		for(const message of messages)
		{
			if(!message.response)
			{
				continue;
			}

			const response = message.response();

			c.write(response.blob);
		}
	});
});

server.listen(564, () => console.log(`Listening!`));

MessageService.target.addEventListener('read', event => {
	process.stderr.write(`\n\u001b[35m Read event on ${event.detail.file} \u001b[39m\n`);
	// event.override(`Content overridden on read!\n`);
	// event.preventDefault();
});

MessageService.target.addEventListener('write', event => {
	process.stderr.write(`\n\u001b[35m Write event on ${event.detail.file} \u001b[39m\n`);
	// event.override(`Content overridden on write!\n`);
	// 	event.preventDefault();
});

MessageService.target.addEventListener('list', event => {
	process.stderr.write(`\n\u001b[35m List event on ${event.detail.file} \u001b[39m\n`);
	// event.override(['File-X', 'File-Y', 'File-Z']);
	// event.preventDefault();
});
