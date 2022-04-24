class File
{
	path      = '';
	size      = 0;
	deleted   = false;
	parent    = null;
	directory = false;

	fullPath()
	{
		const parentPath = this.parent ? this.parent.fullPath() : '';

		return parentPath
			? (parentPath + '/' + this.path)
			: this.path;
	}
}

module.exports = { File };
