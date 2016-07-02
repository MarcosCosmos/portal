//not a type onto itself, it would be a bit of a singleton if it could be instantiated or was properly global, though more of a namespace amongst this scope. That said, it does kind of make the app itself a singleton, unless it starts to support multiple callbacks for one trigger?
//actually even this, unless the CallbackSystem is added to the prototype of MultiChatApp such that it's triggers are seperated (with the exception of possibly the resources loaded etc ones, which arec what it was originally for).
//that said though, I can't see justification for needing multiple apps, and if so, shoving them into iframes should suffice more or less?
var CallbackSystem = {callbacks:{}};

CallbackSystem.get = function(key)
{
	if(typeof CallbackSystem.callbacks[key] !== 'undefined')
	{
		if(typeof CallbackSystem.callbacks[key].callback !== 'undefined')
		{
			return typeof CallbackSystem.callbacks[key].callback;
		}
	}
	return false;
}

CallbackSystem.set = function(key, callback)
{
	if(typeof CallbackSystem.callbacks[key] === 'undefined')
	{
		CallbackSystem.callbacks[key] = {ready: false};
	}
	CallbackSystem.callbacks[key].callback = callback;
	if(CallbackSystem.callbacks[key].ready)
	{
		CallbackSystem.callbacks[key].callback();
	}
}

CallbackSystem.remove = function(key)
{
	if(typeof CallbackSystem.callbacks[key] !== 'undefined' && typeof CallbackSystem.callbacks[key].callback !== 'undefined')
	{
		delete CallbackSystem.callbacks[key].callback;
	}
}

//once callbacks are erased once called
CallbackSystem.setOnce = function(key, callback)
{
	CallbackSystem.set(
		key,
		function()
		{
			callback();
			CallbackSystem.remove(key);
		}
	);
}

CallbackSystem.trigger = function(key)
{
	if(typeof CallbackSystem.callbacks[key] === 'undefined')
	{
		CallbackSystem.callbacks[key] = {ready: true};
	}
	else if(typeof CallbackSystem.callbacks[key].callback !== 'undefined')
	{
		CallbackSystem.callbacks[key].callback();
	}
}

module.exports = {
	CallbackSystem
}