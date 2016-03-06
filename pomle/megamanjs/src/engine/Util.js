Engine.Util = {
    renameFunction: function (name, fn) {
        return (new Function("return function (call) { return function " + name +
            " () { return call(this, arguments) }; };")())(Function.apply.bind(fn));
    },

    extend: function(child, parent)
    {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    },

    mixin: function()
    {
        var subject = arguments[0].prototype;
        for (var i = 1, l = arguments.length; i < l; ++i) {
            var source = arguments[i].prototype;
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    var descriptor = Object.getOwnPropertyDescriptor(source, prop);
                    Object.defineProperty(subject, prop, descriptor);
                }
            }
        }
    },

    string: {
        fill: function(x, n)
        {
            var s = '';
            for (;;) {
                if (n & 1) s += x;
                n >>= 1;
                if (n) x += x;
                else break;
            }
            return s;
        }
    }
}
