const File = require('./File').File;
const Qid  = require('./Qid').Qid;

class FileService
{
	static byFid  = new Map;
	static byPath = new Map;

	static assignFid(fid, file)
	{
		// if(this.byFid.has(fid))
		// {
		// 	throw new Error(`FID ${fid} already assigned!`);
		// }

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

		const file = new File;

		file.directory = file.directory || directory;
		file.path = path;
		file.qid  = Qid.for(this.byPath.size, directory);

		this.byPath.set(path, file);

		return file;
	}
}

module.exports = { FileService };
