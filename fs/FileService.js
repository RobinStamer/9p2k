const Directory = require('./Directory').Directory;
const File = require('./File').File;
const Qid  = require('../session/Qid').Qid;

class FileService
{
	static byFid  = new Map;
	static byPath = new Map;

	static assignFid(fid, file)
	{
		if(this.byFid.has(fid))
		{
			// if(this.byFid.get(fid) !== file)
			// {
			// 	throw new Error(`FID ${fid} already assigned!`);
			// }
		}

		this.byFid.set(fid, file);
	}

	static getByFid(fid)
	{
		if(!this.byFid.has(fid))
		{
			return;
		}

		return this.byFid.get(fid);
	}

	static forgetFid(fid)
	{
		if(!this.byFid.has(fid))
		{
			return;
		}

		this.byFid.delete(fid);
	}

	static getByPath(path, directory = false)
	{
		if(this.byPath.has(path))
		{
			return this.byPath.get(path);
		}

		// const file = new (directory ? Directory : File)({path});

		// file.directory = file.directory || directory;
		// file.qid  = Qid.for(this.byPath.size, directory);

		// this.byPath.set(path, file);

		// return file;
	}

	static register(...files)
	{
		for(const file of files)
		{
			const parent = file.parent;

			let path = '/';

			if(parent)
			{
				path = (parent.path !== '/')
					? parent.fullPath() + '/' + file.name
					: '/' + file.name;
			}

			// if(this.byPath.has(path) && this.byPath.get(path) !== file)
			// {
			// 	throw new Error(`Path "${path}" already registered!`);
			// }

			this.byPath.set(path, file);
		}
	}
}

module.exports = { FileService };
