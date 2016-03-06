/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/login.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageLogin
     * @extends BasePage
     */
    var PageLogin = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.login.title;
        },
        /**
         * @method render
         * @returns {PageLogin}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            app.sidebars.disable();
            this.elements.loginPassword = this.$("#login-password");
            this.elements.loginUsername = this.$("#login-username");
            this.elements.message = this.$("#message");
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'keyup #login-password': 'handleKeyUpPressed',
            'vclick #button-login': 'handleButtonLoginClicked',
            'vclick #button-new': 'handleButtonNewClicked'
        }),
        /**
         * @method handleButtonLoginClicked
         * @param {Event} event
         */
        handleButtonLoginClicked: function(event) {
            event.preventDefault();
            var self = this;
            var password = this.elements.loginPassword.val();
            var username = this.elements.loginUsername.val();
            app.dialogs.show().element('.message-title').text('Logging In');
            this.disableForm().elements.message.empty();
            app.user.login(username, password, function() {
                app.analytics.trackUserEvent('logged in');
                app.api.clearGuest();
                app.reload();
            }, function(error) {
                if (error.responseJSON.message) {
                    self.enableForm().elements.message.text(error.responseJSON.message);
                } else {
                    self.enableForm().elements.message.empty();
                }
                app.dialogs.hide();
            });
        },
        /**
         * @method handleButtonNewClicked
         * @param {Event} event
         */
        handleButtonNewClicked: function(event) {
            event.preventDefault();
        },
        /**
         * @method handleKeyUpPressed
         * @param {Object} event
         */
        handleKeyUpPressed: function(event) {
            if (event.keyCode === 13) {
                this.handleButtonLoginClicked(event);
            } else {
                event.preventDefault();
            }
        }
    });

    return PageLogin;
});
