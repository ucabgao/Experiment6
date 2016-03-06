/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/account-creation/create-account.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageCreateAccount
     * @extends BasePage
     */
    var PageCreateAccount = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Sign Up';
        },
        /**
         * @method render
         * @returns {PageCreateAccount}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.elements.email = this.$('#create-account-email');
            this.elements.message = this.$('#message');
            this.elements.password = this.$('#create-account-password');
            this.elements.username = this.$('#create-account-username');
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-create': 'handleButtonCreateClicked',
            'vclick #button-skip': 'handleButtonSkipClicked'
        }),
        /**
         * @method checkPassword
         * @param {String} password
         * @returns {Boolean}
         */
        checkPassword: function(password) {
            return password.split('').length > 5;
        },
        /**
         * @method handleButtonCreateClicked
         * @param {Event} event
         */
        handleButtonCreateClicked: function(event) {
            event.preventDefault();
            var self = this;
            if (this.checkPassword(this.elements.password.val())) {
                this.disableForm().elements.message.empty();
                app.user.createNew({
                    email: this.elements.email.val(),
                    name: this.elements.username.val(),
                    password: this.elements.password.val()
                }, function() {
                    app.analytics.trackUserEvent('account created');
                    app.reload();
                }, function(error) {
                    self.enableForm().elements.message.text(error.responseJSON.message);
                    app.dialogs.hide();
                });
            } else {
                self.enableForm().elements.message.text('Password must be at least 6 characters.');
            }
        },
        /**
         * @method handleButtonSkipClicked
         * @param {Event} event
         */
        handleButtonSkipClicked: function(event) {
            event.preventDefault();
            var self = this;
            this.disableForm().elements.message.empty();
            app.user.createNew(null, function() {
                app.reload();
            }, function(error) {
                self.enableForm().elements.message.text(error.responseJSON.message);
                app.dialogs.hide();
            });
        }
    });

    return PageCreateAccount;
});