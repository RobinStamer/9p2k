const MessageService = require('./Message').MessageService;
const net = require('net');
const server = net.createServer(c => {
	c.on('end', () => console.log('server disconnected!'));
	c.on('data', blob => {
		const messages = MessageService.parse(blob);
		for(const message of messages)
		{
			if(message.response)
			{
				c.write(message.response().blob);
			}
		}
	});
});

module.exports = { Server:server };

