class File
{
	path      = '';
	size      = 0;
	mode      = 0o100755
	uid       = 1000;
	gid       = 1000;
	deleted   = false;
	parent    = null;
	directory = false;
	content   = undefined;

	fullPath()
	{
		const parentPath = this.parent ? this.parent.fullPath() : '';

		return parentPath
			? (parentPath + '/' + this.path)
			: this.path;
	}
}

module.exports = { File };
