const MessageService = require('../protocol/MessageService').MessageService;

const net = require('net');

// Check for tcp!host!port or unix!socket dialstrings
const rDial = /^(tcp![^!]+![0-9]+|unix![^!]+)$/;

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

server.listen = (listen => {
	return function (...args)
	{
		if (rDial.test(args[0]))
		{
			listen.apply(this, args[0].split('!').slice(1).concat(args.slice(1)));
		}
		else
		{
			listen.apply(this, args);
		}
	}
})(server.listen);

module.exports = { Server:server };

