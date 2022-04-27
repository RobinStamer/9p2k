class TimeFile extends File
{
	getContent()
	{
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

			return formatter.format(date) + "\n";
		}
		catch(error)
		{
			return String(error) + "\n";;
		}
	}
}

module.exports = { TimeFile };
