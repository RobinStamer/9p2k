class Group
{
	maxSize;
	ranker;
	start;

	items = new Set;

	constructor(start, maxSize, ranker)
	{
		this.maxSize = maxSize
		this.ranker  = ranker;
		this.start   = start;
	}

	addItem(item)
	{
		const rank = this.ranker(item);

		if(rank - this.start > this.maxSize)
		{
			return false;
		}

		this.items.add(item);

		return true;
	}

	getDate()
	{
		return new Date(this.start)
		.toLocaleString('en-US', {
			hour:"2-digit", minute:"2-digit",
			month:"2-digit", day:"2-digit", year:"numeric",
			hour12:false
		})
		.replace(/\//g, '-')
		.replace(/(\d{1,2})-(\d{1,2})-(\d{4})(.+)/, '$3-$1-$2$4');
	}
}

module.exports = { Group };
