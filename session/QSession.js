const Qid = require('./Qid').Qid;

class QSession
{
	static files = new Map;
	static qids  = new Map;

	static getByQid(qid)
	{
		if(!this.files.has(qid))
		{
			return false;
		}

		return this.files.get(qid);
	}

	static getQid(file)
	{
		if(this.qids.has(file))
		{
			return this.qids.get(file);
		}

		const newQid = Qid.for(this.qids.size, file.directory);

		this.files.set(newQid, file);
		this.qids.set(file, newQid);

		return newQid;
	}
}

module.exports = { QSession };
