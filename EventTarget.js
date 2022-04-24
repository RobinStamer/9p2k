const Event = require('./Event').Event;

class EventTarget
{
	listeners = new Map;
	parent    = null;

	constructor(parent)
	{
		this.parent = parent;
	}

	addEventListener(eventType, callback, options = {once: false})
	{
		if(!this.listeners.has(eventType))
		{
			this.listeners.set(eventType, new Map);
		}

		const listeners = this.listeners.get(eventType);

		listeners.set(callback, options);
	}

	removeEventListener(eventType, callback)
	{
		if(!this.listeners.has(eventType))
		{
			return;
		}

		const listeners = this.listeners.get(eventType);

		listeners.delete(callback);
	}

	dispatchEvent(event)
	{
		if(!this.listeners.has(event.type))
		{
			return;
		}

		const listeners = this.listeners.get(event.type);

		for(const [listener, options] of listeners)
		{
			listener(event);

			if(options.once)
			{
				listeners.delete(listener);
			}

			if(event.propagationStopped === Event.ZERO_PROPAGATION)
			{
				break;
			}
		}

		if(!event.propagationStopped)
		{
			if(this.parent && this.parent.dispatchEvent)
			{
				this.parent.dispatchEvent(event);
			}
		}

		if(event.cancellable && event.defaultPrevented)
		{
			return false;
		}

		return event;
	}
}

module.exports = { EventTarget };
