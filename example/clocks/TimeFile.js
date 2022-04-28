const File = require('../../fs/File').File;

class TimeFile extends File
{
	getContent(offset = 0, length = 0)
	{
		let string = '';
		const date = new Date;

		try
		{
			const formatter = new Intl.DateTimeFormat(
				'en-US', {
					timeZone: String(this.content ?? '').trim() || 'GMT'
					, timeStyle: 'full'
					, dateStyle: 'full'
					, hour12: false
				}
			);

			string = formatter.format(date) + "\n";
		}
		catch(error)
		{
			string = String(error) + "\n";
		}

		return Buffer.from(string, 'utf-8').slice(Number(offset), Number(offset) + Number(length))
	}
}

module.exports = { TimeFile };
