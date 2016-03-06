/**
 * @module Framework
 */
define([], function() {
    /**
     * @class BaseView
     * @extends Backbone.View
     */
    return Backbone.View.extend({
        /**
         * @property elements
         * @type Object
         */
        elements: {},
        /**
         * @property events
         * @type Object
         */
        events: {
            'vclick .action-back': 'handleActionBackClicked',
            'vclick .action-logout': 'handleActionLogoutClicked',
            'vclick .navigate': 'handleNavigateClicked'
        },
        /**
         * @method compile
         * @param {String} template
         * @returns {String}
         */
        compile: function(template) {
            return handlebars.compile(template)(app.strings);
        },
        /**
         * @method destroy
         */
        destroy: function() {
            var keys = _.keys(this);
            for (var key in keys) {
                this[keys[key]] = undefined;
            }
        },
        /**
         * @method getHeight
         * @returns {Number}
         */
        getHeight: function() {
            return this.$el.height();
        },
        /**
         * @method getWidth
         * @returns {Number}
         */
        getWidth: function() {
            return this.$el.width();
        },
        /**
         * @method handleActionBackClicked
         * @param {Event} event
         */
        handleActionBackClicked: function(event) {
            event.preventDefault();
            if (app.router) {
                app.router.back();
            } else {
                location.back();
            }
        },
        /**
         * @method handleActionLogoutClicked
         * @param {Event} event
         */
        handleActionLogoutClicked: function(event) {
            event.preventDefault();
            app.user.logout();
        },
        /**
         * @method handleNavigateClicked
         * @param {Event} event
         */
        handleNavigateClicked: function(event) {
            event.preventDefault();
            var url = $(event.currentTarget).data('url').replace('#', app.isLocalhost() ? '/#' : '');
            var replace = $(event.currentTarget).data('replace');
            var trigger = $(event.currentTarget).data('trigger');
            switch (url) {
                case 'getting-started':
                    mixpanel.track('Clicked New User');
                    break;
                case 'forum':
                    if (app.isNative()) {
                        window.open('http://discourse.skritter.com', '_system');
                    } else {
                        window.open('http://discourse.skritter.com', '_blank');
                    }
                    break;
                case 'login':
                    mixpanel.track('Clicked Existing User');
                    break;
            }
            app.router.navigate(url, {
                replace: replace === undefined ? false : replace,
                trigger: trigger === undefined ? true : trigger
            });
        },
        /**
         * @method loadFont
         * @param {String} [fontClass]
         * @returns {BaseView}
         */
        loadFont: function(fontClass) {
            fontClass = fontClass ? fontClass : app.user.isChinese() ? 'chinese-text' : 'japanese-text';
            this.$('.asian-font').addClass(fontClass);
            return this;
        },
        /**
         * @method remove
         * @returns {BaseView}
         */
        remove: function() {
            this.$el.empty();
            this.stopListening();
            this.undelegateEvents();
            return this;
        }
    });
});
