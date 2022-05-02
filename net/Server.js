const MessageService = require('../protocol/MessageService').MessageService;

const net = require('net');

const server = net.createServer(c => {
	c.on('end', () => console.log('server disconnected!'));
	c.on('data', blob => MessageService.parse(blob).forEach(message => {
		if(message.response)
		{
			c.write(message.response().blob);
		}
	}));
});

module.exports = { Server:server };

