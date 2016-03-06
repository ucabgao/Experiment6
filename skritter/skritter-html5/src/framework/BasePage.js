/**
 * @module Framework
 */
define([
    'framework/BaseView',
], function(BaseView) {
    /**
     * @class BasePage
     * @extends BaseView
     */
    return BaseView.extend({
        /**
         * @property el
         * @type String
         */
        el: "#application",
        /**
         * @property title
         * @type String
         */
        title: undefined,
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BaseView.prototype.events, {
                'vclick .content-container': 'handleContentContainerClicked',
                'vclick .navbar-item': 'handleNavbarItemClicked',
                'vclick .navbar-menu.toggle': 'handleMenuToggleClicked'
            }
        ),
        /**
         * @method disableForm
         * @param {String} [selector]
         * @returns {BasePage}
         */
        disableForm: function(selector) {
            this.$((selector ? selector + ' ': '') + ':input').prop('disabled', true);
            return this;
        },
        /**
         * @method enableForm
         * @param {String} [selector]
         * @returns {BasePage}
         */
        enableForm: function(selector) {
            this.$((selector ? selector: ' ') + ':input').prop('disabled', false);
            return this;
        },
        /**
         * @method getContent
         * @returns {Element}
         */
        getContent: function() {
            return this.$('#content');
        },
        /**
         * @method getContentHeight
         * @returns {Number}
         */
        getContentHeight: function() {
            return this.$('#content').height();
        },
        /**
         * @method getContentWidth
         * @returns {Number}
         */
        getContentWidth: function() {
            return this.$('#content').width();
        },
        /**
         * @method handleContentContainerClicked
         */
        handleContentContainerClicked: function(event) {
            if (app.sidebars && app.sidebars.isExpanded()) {
                event.stopPropagation();
                event.preventDefault();
                app.sidebars.hide();
            }
        },
        /**
         * @method handleMenuToggleClicked
         * @param {Event} event
         */
        handleMenuToggleClicked: function(event) {
            if (app.sidebars) {
                app.sidebars.select('menu').toggle();
            } else {
                event.preventDefault();
            }
        },
        /**
         * @method preloadFont
         * @returns {View}
         */
        preloadFont: function() {
            if (app.user.getLanguageCode() === 'zh') {
                this.$('.font-preloader').addClass('chinese-text');
            } else {
                this.$('.font-preloader').addClass('japanese-text');
            }
            return this;
        },
        /**
         * @method setTitle
         * @param {String} title
         * @returns {View}
         */
        setTitle: function(text) {
            document.title = text + ' - ' + app.strings.application.name;
            this.$('.navbar-title').text(text);
            return this;
        }
    });
});
