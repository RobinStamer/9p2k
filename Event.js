const override = Symbol('Override');

class Event
{
	[override] = undefined;

	constructor(eventType, {cancellable = false, bubbles = false, detail = null})
	{
		Object.defineProperties(this, {
			propagationStopped: {value: 0, writable:true, configurable:true, enumerable: true}
			, defaultPrevented: {value: 0, writable:true, configurable:true, enumerable: true}
			, cancellable:      {value: cancellable, enumerable: true}
			, bubbles:          {value: bubbles, enumerable: true}
			, detail:           {value: detail, enumerable: true}
			, type:             {value: eventType, enumerable: true}
		});
	}

	preventDefault()
	{
		Object.defineProperty(this, 'defaultPrevented', {value: true});
	}

	stopPropagation()
	{
		this.propagationStopped = EVENT.STOP_PROPAGATION;
	}

	stopImmediatePropagation()
	{
		Object.defineProperty(this, 'propagationStopped', {value: EVENT.ZERO_PROPAGATION});
	}

	override(data)
	{
		this[override] = data;
	}

	getOverride(defaultValue)
	{
		return this[override] ?? defaultValue;
	}
}

Object.defineProperties(Event, {
	ALLOW_PROPAGATION:  {value: 0}
	, STOP_PROPAGATION: {value: 1}
	, ZERO_PROPAGATION: {value: 2}
});

module.exports = { Event };
