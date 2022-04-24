const net      = require('net');
const packets  = require('./packets');
const Messages = require('./Message');

const server = net.createServer(c => {
	c.on('end', () => console.log('server disconnected!'));
	c.on('data', blob => {
		const messages = Messages.MessageFactory.parse(blob);
		for(const message of messages)
		{
			if(!message.response)
			{
				continue;
			}

			const response = message.response();

			if(response)
			{
				c.write(response.blob);
			}
		}
	});
});

server.listen(564, () => console.log(`Listening!`));
