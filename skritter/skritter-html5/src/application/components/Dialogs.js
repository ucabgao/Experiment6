/**
 * @module Framework
 * @submodule Components
 */
define([
    'framework/BaseView',
    'require.text!templates/dialogs.html'
], function(BaseView, template) {
    /**
     * @class Dialogs
     * @extends BaseView
     */
    var Dialogs = BaseView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.id = undefined;
            this.options = {};
            this.render();
        },
        /**
         * @property el
         * @type String
         */
        el: '#dialogs',
        /**
         * @method render
         * @returns {Dialogs}
         */
        render: function() {
            this.$el.html(this.compile(template));
            return this;
        },
        /**
         * @property events
         * @type Object
         */
        events: {},
        /**
         * @method element
         * @param {String} [selector]
         * @returns {jQuery}
         */
        element: function(selector) {
            return this.$el.find('.' + this.id + (selector ? ' ' + selector : ''));
        },
        /**
         * @method hide
         * @param {Function} [callback]
         * @returns {Dialogs}
         */
        hide: function(callback) {
            var self = this;
            this.element().modal('hide').one('hidden.bs.modal', function() {
                self.id = undefined;
                if (typeof callback === 'function') {
                    callback();
                }
            });
            return this;
        },
        /**
         * @method isHidden
         * @returns {Boolean}
         */
        isHidden: function() {
            return this.id ? false : true;
        },
        /**
         * @method isShown
         * @returns {Boolean}
         */
        isShown: function() {
            return this.id ? true : false;
        },
        /**
         * @method progress
         * @param {Number} percent
         * @returns {Dialogs}
         */
        progress: function(percent) {
            this.element('.progress .progress-bar').width(percent + '%');
            this.element('.progress .progress-bar').attr('aria-valuenow', percent);
            this.element('.progress .sr-only').text(percent + '% Complete');
            return this;
        },
        /**
         * @method reset
         * @returns {Dialogs}
         */
        reset: function() {
            this.element('.modal-body').children('*').show();
            this.element('.modal-body').children('*').empty();
            return this;
        },
        /**
         * @method show
         * @param {String} [dialogId]
         * @param {Function} [callback]
         * @param {Object} [options]
         * @returns {Dialogs}
         */
        show: function(dialogId, callback, options) {
            var self = this;
            this.id = dialogId ? 'dialog-' + dialogId : 'dialog-default';
            options = options ? options : this.options;
            options.backdrop = options.backdrop ? options.backdrop : 'static';
            options.keyboard = options.keyboard ? options.keyboard : false;
            options.show = options.show ? options.show : true;
            options.remote = options.remote ? options.remote : false;
            if (this.id === 'dialog-default') {
                this.reset();
            }
            this.element().modal(options).one('shown.bs.modal', function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
            this.element().one('hidden.bs.modal', function(event) {
                $(event.target).find('*').off();
                self.id = undefined;
            });
            return this;
        }
    });

    return Dialogs;
});