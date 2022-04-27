class TimeDirectory extends Directory
{
	populated = false

	getChildren()
	{
		if(!this.populated)
		{
			this.children.push(
				// new TimeDirectory({name:'more-clocks',parent:this,exists:true}),
				new TimeFile({name:'gmt',parent:this,exists:true,content:''}),
				new TimeFile({name:'new-york',parent:this,exists:true,content:'America/New_York'}),
				new TimeFile({name:'chicago',parent:this,exists:true,content:'America/Chicago'}),
				new TimeFile({name:'los-angeles',parent:this,exists:true,content:'America/Los_Angeles'}),
			);

			this.populated = true;
		}

		return this.children;
	}

	newFile(name, exists = true)
	{
		if(name[0] === '.')
		{
			return;
			//return super.newFile(name);
		}

		const file = new TimeFile({name,parent:this,exists});

		this.addChildren(file);

		return file;
	}
}

module.exports = { TimeDirectory };
