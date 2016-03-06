/**
 * @module Application
 * @submodule Components
 */
define([
    'framework/BaseView',
    'require.text!templates/sidebars.html'
], function(BaseView, template) {
    /**
     * @class Sidebars
     * @extends BaseView
     */
    var Sidebars = BaseView.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.direction = 'left';
            this.enabled = true;
            this.name = 'default';
            this.sidebar = undefined;
            this.speed = 150;
            this.render();
        },
        /**
         * @property el
         * @type String
         */
        el: '#sidebars',
        /**
         * @method render
         * @returns {Sidebars}
         */
        render: function() {
            this.$el.html(this.compile(template));
            this.select();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BaseView.prototype.events, {
            'vclick #sidebar-info .edit-definition': 'handleEditDefinitionClicked',
            'vclick #sidebar-info .edit-mnemonic': 'handleEditMnemonicClicked',
            'vclick #sidebar-info .info-ban': 'handleInfoBanClicked',
            'vclick #sidebar-info .info-pleco': 'handleInfoPlecoClicked',
            'vclick #sidebar-info .info-sentence': 'handleInfoSentenceClicked',
            'vclick #sidebar-info .info-star': 'handleInfoStarClicked',
            'swipeleft .sidebar': 'handleSidebarSwipeLeft',
            'swiperight .sidebar': 'handleSidebarSwipeRight'
        }),
        /**
         * @method disable
         * returns {Sidebars}
         */
        disable: function() {
            if (this.isExpanded()) {
                this.hide();
            }
            this.enabled = false;
        },
        /**
         * @method enable
         * returns {Sidebars}
         */
        enable: function() {
            this.enabled = true;
        },
        /**
         * @method handleEditDefinitionClicked
         * @param {Event} event
         */
        handleEditDefinitionClicked: function(event) {
            event.preventDefault();
            this.trigger('click:edit-definition');
        },
        /**
         * @method handleEditMnemonicClicked
         * @param {Event} event
         */
        handleEditMnemonicClicked: function(event) {
            event.preventDefault();
            this.trigger('click:edit-mnemonic');
        },
        /**
         * @method handleInfoBanClicked
         * @param {Event} event
         */
        handleInfoBanClicked: function(event) {
            event.preventDefault();
            this.trigger('click:info-ban');
        },
        /**
         * @method handleInfoPlecoClicked
         * @param {Event} event
         */
        handleInfoPlecoClicked: function(event) {
            event.preventDefault();
            this.trigger('click:info-pleco');
        },
        /**
         * @method handleInfoSentenceClicked
         * @param {Event} event
         */
        handleInfoSentenceClicked: function(event) {
            event.preventDefault();
            var sentenceToggle = this.$('#sidebar-info .info-sentence-toggle');
            if (sentenceToggle.is(':hidden')) {
                this.$('#sidebar-info .info-sentence-toggle').show('slide', {direction: 'up'}, 300);
            } else {
                this.$('#sidebar-info .info-sentence-toggle').hide('slide', {direction: 'up'}, 300);
            }
        },
        /**
         * @method handleInfoStarClicked
         * @param {Event} event
         */
        handleInfoStarClicked: function(event) {
            event.preventDefault();
            this.trigger('click:info-star');
        },
        /**
         * @method handleSidebarSwipeLeft
         * @param {Event} event
         */
        handleSidebarSwipeLeft: function(event) {
            event.preventDefault();
            if (this.direction === 'left') {
                this.hide();
            }
        },
        /**
         * @method handleSidebarSwipeRight
         * @param {Event} event
         */
        handleSidebarSwipeRight: function(event) {
            event.preventDefault();
            if (this.direction === 'right') {
                this.hide();
            }
        },
        /**
         * @method hide
         * @param {Number} [speed]
         * @returns {Sidebars}
         */
        hide: function(speed) {
            var self = this;
            speed = undefined ? this.speed : speed;
            if (this.enabled && !this.moving) {
                this.moving = true;
                if (this.name === 'menu') {
                    $('.navbar-menu.toggle').removeClass('active');
                }
                this.sidebar.removeClass('expanded');
                this.sidebar.hide('slide', {direction: this.direction}, speed, function() {
                    self.moving = false;
                });
            }
            return this;
        },
        /**
         * @method isCollapsed
         * @returns {Boolean}
         */
        isCollapsed: function() {
            return this.sidebar.hasClass('expanded') ? false : true;
        },
        /**
         * @method isExpanded
         * @returns {Boolean}
         */
        isExpanded: function() {
            return this.sidebar.hasClass('expanded') ? true : false;
        },
        /**
         * @method select
         * @param {String} [name]
         * @returns {Sidebars}
         */
        select: function(name) {
            var sidebar = this.$('#sidebar-' + name);
            if (this.sidebar) {
                this.hide();
            }
            if (sidebar.length) {
                this.direction = sidebar.hasClass('right') ? 'right' : 'left';
                this.name = name;
                this.sidebar = sidebar;
            } else {
                this.direction = 'left';
                this.name = 'default';
                this.sidebar = this.$('#sidebar-default');
            }
            return this;
        },
        /**
         * @method show
         * @param {Number} [speed]
         * @returns {Sidebars}
         */
        show: function(speed) {
            var self = this;
            speed = undefined ? this.speed : speed;
            if (this.enabled && !this.moving) {
                this.moving = true;
                if (this.name === 'menu') {
                    $('.navbar-menu.toggle').addClass('active');
                    $('.application-version').text(app.getVersion());
                }
                this.sidebar.addClass('expanded');
                this.sidebar.show('slide', {direction: this.direction}, speed, function() {
                    self.moving = false;
                });
            }
            return this;
        },
        /**
         * @method toggle
         */
        toggle: function() {
            if (this.isExpanded()) {
                this.hide();
            } else {
                this.show();
            }
        }
    });

    return Sidebars;
});