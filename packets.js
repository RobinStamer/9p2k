module.exports = {
	//9p2000
	T_VERSION: 100,
	R_VERSION: 101,

	T_AUTH:    102,

	T_ATTACH:  104,
	R_ATTACH:  105,
	R_ERROR:   107,

	T_FLUSH:   108,
	R_FLUSH:   109,

	T_WALK:    110,
	R_WALK:    111,

	T_OPEN:    112,
	R_OPEN:    113,

	T_CREATE:  114,
	R_CREATE:  115,

	T_READ:    116,
	R_READ:    117,

	T_WRITE:   118,
	R_WRITE:   119,

	T_CLUNK:   120,
	R_CLUNK:   121,

	T_REMOVE:  122,

	T_STAT:    124,
	R_STAT:    125,

	T_WSTAT:   126,

	//9p2000.L
	R_LERROR:  7,

	T_LOPEN:   12,
	R_LOPEN:   13,

	T_GETATTR: 24,
	R_GETATTR: 25,

	T_READDIR: 40,
	R_READDIR: 41,

	T_STATFS: 8,
	R_STATFS: 9,

	T_XATTRWALK: 30,
	R_XATTRWALK: 31,
};
