#!/usr/bin/env ext

var	fs	= require('fs')
	,dir	= '/mnt/9p/input'
	,path	= require('path')
	,data	= {}
	,counter	= 0
	,r	= /(20[0-9][0-9])([01][0-9])([0123][0-9])/
	,g	= {}

function main() {
	fs.readdir(dir, function(err, data) {
		for (var d of data) {
			verifyDir(`${d}/Camera`)
		}
	})
}

function verifyDir(d, noRec) {
	++counter

	fs.stat(`${dir}/${d}`, function(err, stat) {
		if (err) {
			if (!noRec) {
				verifyDir(path.dirname(d), true)
			}

			--counter
			
			return
		}

		data[d] = {
			name:	d
			,contents: []
		}

		fs.readdir(`${dir}/${d}`, function(e, list) {
			for (var f of list) {
				var m, x
				if (m = r.exec(f)) {
					data[d].contents.push(x = {
						name:	f
						,date:	`${m[1]}-${m[2]}-${m[3]}`
						,year:	m[1]
						,month:	m[2]
						,day:	m[3]
					})

					group(fs.statSync(`${dir}/${d}/${f}`), x, m) 
				}
			}

			tryprint()
		})
	})
}

function getGroup(date, stat) {
	var	i	= 0
		,group	= g[date]
		,ts	= stat.mtimeMs
		,delta	= 15 * 60000 // 15 minutes

	if (!group) {
		group = [{
			b:	ts - delta
			,e:	ts + delta
		}]

		g[date] = group
	}

	for (; i < group.length; ++i) {
		if (group[i].b < ts && ts < group[i].e) {
			break
		}
	}

	if (group.length === i) {
		// We fix the time range in the next block
		group.push({b: ts, e: ts})
	}

	// Adjust the range that this group encompases
	group[i].b = Math.min(group[i].b, ts - delta)
	group[i].e = Math.max(group[i].e, ts + delta)

	return i
}

function group(stat, x, m) {
	var	date	= `${m[1]}/${m[2]}/${m[3]}`
		,group	= getGroup(date, stat)

	data[date] = data[date] || []
	data[date][group] = data[date][group] || []
	data[date][group].push(x)
}

function print() {
	console.log(JSON.stringify(data, null, '\t'))
}

function tryprint() {
	--counter

	if (!counter) {
		print()
	}
}

main()
