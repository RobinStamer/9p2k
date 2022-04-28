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
}

module.exports = { Group };
