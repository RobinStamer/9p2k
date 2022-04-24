class VirtualDirectory
{
	members = new Map;
}

class VirtualFile
{
	contents  = new Uint8Array(1024);
	created   = 0;
	modified  = 0;
	accessed  = 0;
}
