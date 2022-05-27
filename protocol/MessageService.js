const Constants             = require('../protocol/Constants');
const { NString }           = require('../protocol/NString');
const { Qid }               = require('../session/Qid');
const { QSession }          = require('../session/QSession');
const { EventTarget }       = require('../events/EventTarget');
const { Event }             = require('../events/Event');
const { File }              = require('../fs/File');
const { FileService }       = require('../fs/FileService');
const { Message }           = require('./Message');
const { RMessage }          = require('./RMessage');
const { TMessage }          = require('./TMessage');
const { RErrorMessage }     = require('./RErrorMessage');
const { RVersionMessage }   = require('./RVersionMessage');
const { TVersionMessage }   = require('./TVersionMessage');
const { TAttachMessage }    = require('./TAttachMessage');
const { RAttachMessage }    = require('./RAttachMessage');
const { TStatMessage }      = require('./TStatMessage');
const { RStatMessage }      = require('./RStatMessage');
const { TWStatMessage }     = require('./TWStatMessage');
const { RWStatMessage }     = require('./RWStatMessage');
const { TRemoveMessage }    = require('./TRemoveMessage');
const { RRemoveMessage }    = require('./RRemoveMessage');
const { RGetAttrMessage }   = require('./RGetAttrMessage');
const { TGetAttrMessage }   = require('./TGetAttrMessage');
const { RSetAttrMessage }   = require('./RSetAttrMessage');
const { TSetAttrMessage }   = require('./TSetAttrMessage');
const { RWalkMessage }      = require('./RWalkMessage');
const { TWalkMessage }      = require('./TWalkMessage');
const { RlOpenMessage }     = require('./RlOpenMessage');
const { TlOpenMessage }     = require('./TlOpenMessage');
const { RReadDirMessage }   = require('./RReadDirMessage');
const { TReadDirMessage }   = require('./TReadDirMessage');
const { RStatFsMessage }    = require('./RStatFsMessage');
const { TStatFsMessage }    = require('./TStatFsMessage');
const { RXAttrWalkMessage } = require('./RXAttrWalkMessage');
const { TXAttrWalkMessage } = require('./TXAttrWalkMessage');
const { RReadMessage }      = require('./RReadMessage');
const { TReadMessage }      = require('./TReadMessage');
const { ROpenMessage }      = require('./ROpenMessage');
const { TOpenMessage }      = require('./TOpenMessage');
const { RWriteMessage }     = require('./RWriteMessage');
const { TWriteMessage }     = require('./TWriteMessage');
const { RClunkMessage }     = require('./RClunkMessage');
const { TClunkMessage }     = require('./TClunkMessage');
const { RFlushMessage }     = require('./RClunkMessage');
const { TFlushMessage }     = require('./TClunkMessage');
const { RlErrorMessage }    = require('./RlErrorMessage');

class MessageService
{
	static target = new EventTarget;

	static parse(blob)
	{
		let index = 0;

		const messages = [];

		while(index < blob.length)
		{
			const slice    = new Uint8Array(blob.slice(index));

			const dataView = new DataView(slice.buffer);
			const length   = dataView.getUint32(0, true);
			const current  = blob.slice(index, index + length);

			index += length;

			const message = Message.parse(current);

			switch(message.type)
			{
				case Constants.T_VERSION:
					messages.push( TVersionMessage.parse(current) );
					break;

				case Constants.R_VERSION:
					messages.push( RVersionMessage.parse(current) );
					break;

				case Constants.T_ATTACH:
					messages.push( TAttachMessage.parse(current) );
					break;

				case Constants.R_ATTACH:
					messages.push( RAttachMessage.parse(current) );
					break;

				case Constants.T_STAT:
					messages.push( TStatMessage.parse(current) );
					break;

				case Constants.R_STAT:
					messages.push( RStatMessage.parse(current) );
					break;

				case Constants.T_WSTAT:
					messages.push( TWStatMessage.parse(current) );
					break;

				case Constants.R_WSTAT:
					messages.push( RWStatMessage.parse(current) );
					break;

				case Constants.T_REMOVE:
					messages.push( TRemoveMessage.parse(current) );
					break;

				case Constants.R_REMOVE:
					messages.push( RRemoveMessage.parse(current) );
					break;

				case Constants.T_CLUNK:
					messages.push( TClunkMessage.parse(current) );
					break;

				case Constants.R_CLUNK:
					messages.push( RClunkMessage.parse(current) );
					break;

				case Constants.T_GETATTR:
					messages.push( TGetAttrMessage.parse(current) );
					break;

				case Constants.R_GETATTR:
					messages.push( RGetAttrMessage.parse(current) );
					break;

				case Constants.T_SETATTR:
					messages.push( TSetAttrMessage.parse(current) );
					break;

				case Constants.R_SETATTR:
					messages.push( RSetAttrMessage.parse(current) );
					break;

				case Constants.T_WALK:
					messages.push( TWalkMessage.parse(current) );
					break;

				case Constants.R_WALK:
					messages.push( RWalkMessage.parse(current) );
					break;

				case Constants.T_XATTRWALK:
					messages.push( TXAttrWalkMessage.parse(current) );
					break;

				case Constants.T_LOPEN:
					messages.push( TlOpenMessage.parse(current) );
					break;

				case Constants.R_LOPEN:
					messages.push( RlOpenMessage.parse(current) );
					break;

				case Constants.T_READDIR:
					messages.push( TReadDirMessage.parse(current) );
					break;

				case Constants.R_READDIR:
					messages.push( RReadDirMessage.parse(current) );
					break;

				case Constants.T_READ:
					messages.push( TReadMessage.parse(current) );
					break;

				case Constants.R_READ:
					messages.push( RReadMessage.parse(current) );
					break;

				case Constants.T_WRITE:
					messages.push( TWriteMessage.parse(current) );
					break;

				case Constants.R_WRITE:
					messages.push( RWriteMessage.parse(current) );
					break;

				case Constants.T_STATFS:
					messages.push( TStatFsMessage.parse(current) );
					break;

				case Constants.R_STATFS:
					messages.push( RStatFsMessage.parse(current) );
					break;

				case Constants.T_OPEN:
					messages.push( TOpenMessage.parse(current) );
					break;

				case Constants.R_OPEN:
					messages.push( ROpenMessage.parse(current) );
					break;

				case Constants.T_FLUSH:
					messages.push( TFlushMessage.parse(current) );
					break;

				case Constants.R_FLUSH:
					messages.push( RFlushMessage.parse(current) );
					break;

				default:
					messages.push( Message.parse(current) );
					break;
			}
		}

		return messages;
	}
}

module.exports = { MessageService };
