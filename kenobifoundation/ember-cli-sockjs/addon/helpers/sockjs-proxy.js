/// <reference path="ember.d.ts" />
/// <reference path="sockjs.d.ts" />
/// <reference path="jquery.d.ts" />
/// <reference path="handlebars-1.0.0.d.ts" />
"use strict";
var ember_1 = require('ember');
var sockjs_1 = require('sockjs');
var events = ['close', 'error', 'message', 'open'];
var filter = ember_1["default"].EnumerableUtils.filter;
var indexOf = ember_1["default"].EnumerableUtils.indexOf;
var forEach = ember_1["default"].EnumerableUtils.forEach;
exports.__esModule = true;
exports["default"] = ember_1["default"].ObjectProxy.extend({
    /*
    * {
    *    url: 'String'
    *    type: 'String' (such as 'open', 'message', 'close', and 'error')
    *    callback: The function to envoke
    *    context: The context of the function
    * }
    */
    listeners: null,
    init: function () {
        this._super.apply(this, arguments);
        this.listeners = ember_1["default"].makeArray();
        this.setupInternalListeners();
    },
    /*
    * Adds a callback function into the listeners array which will
    * be invoked later whenever a given `type` event happens.
    *
    * type: must be either 'open', 'message', 'close', 'error'
    */
    on: function (type, callback, context) {
        ember_1["default"].assert(type + ' is not a recognized event name. Please use on of the following: ' + events.join(', '), indexOf(events, type) !== -1);
        ember_1["default"].assert('The second argument must be a function.', ember_1["default"].typeOf(callback) === 'function');
        ember_1["default"].assert('The third argument must be the context of the surrounding object.', ember_1["default"].typeOf(context) !== 'undefined');
        this.listeners.push({
            url: this.socket.url,
            type: type,
            callback: callback,
            context: context
        });
    },
    /*
    * Removes a callback function from the listeners array. This callback
    * will not longer be invoked when the given `type` event happens.
    */
    off: function (type, callback) {
        this.listeners = filter(this.listeners, function (listeners) {
            return !(listeners.callback === callback && listeners.type === type);
        });
    },
    /*
    * Message is the message which will be passed into the native websockets send method
    * and shouldStringify is a boolean which determines if we should call JSON.stringify on
    * the message.
    */
    send: function (message, shouldStringify) {
        if (shouldStringify === void 0) { shouldStringify = false; }
        if (shouldStringify && JSON && JSON.stringify) {
            message = JSON.stringify(message);
        }
        this.socket.send(message);
    },
    close: function () {
        this.socket.close();
    },
    reconnect: function () {
        this.set('socket', new sockjs_1["default"](this.socket.url));
        this.setupInternalListeners();
    },
    setupInternalListeners: function () {
        var _this = this;
        var self = this;
        forEach(events, function (eventName) {
            _this.socket['on' + eventName] = function (event) {
                ember_1["default"].run(function () {
                    var activeListeners = filter(self.listeners, function (listener) {
                        return listener.url === event.currentTarget.url && listener.type === eventName;
                    });
                    // TODO: filter active listeners for contexts that are not destroyed
                    activeListeners.forEach(function (item) {
                        item.callback.call(item.context, event);
                    });
                });
            };
        });
    }
});
