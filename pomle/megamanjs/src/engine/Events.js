Engine.Events = function()
{
    this.events = {};
}

Engine.Events.prototype.bind = function(name, callback)
{
    if (typeof name !== 'string') {
        throw new TypeError("Event name must be string, got " + name);
    }

    if (!this.events[name]) {
        this.events[name] = [];
    }

    this.events[name].push(callback);
    this.gc(name);
}

Engine.Events.prototype.gc = function(name)
{
    if (this.events[name]) {
        var events = this.events[name];
        for (var i = 0, l = events.length; i < l; ++i) {
            if (events[i] === undefined) {
                events.splice(i, 1);
                --i;
                --l;
            }
        }
    }
}

Engine.Events.prototype.bound = function(name, callback)
{
    return this.events[name].indexOf(callback);
}

Engine.Events.prototype.trigger = function(name, values)
{
    if (this.events[name]) {
        var events = this.events[name];
        /* Notice that this method expects to
           get the arguments to be passed as an
           array as second argument. */
        for (var i = 0, l = events.length; i < l; ++i) {
            if (events[i] !== undefined) {
                events[i].apply(this, values);
            }
        }
        return true;
    }
    return false;
}

Engine.Events.prototype.unbind = function(name, callback)
{
    if (this.events[name]) {
        var events = this.events[name];
        var i = events.indexOf(callback);
        if (i !== -1) {
            events[i] = undefined;
            return true;
        }
    }
    return false;
}
