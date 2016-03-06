/**
 * @module Application
 */
define([
    'framework/BaseRouter',
    'pages/account-creation/CreateAccount',
    'pages/account-creation/LanguageSelect',
    'pages/account-creation/ListSelect'
], function(BaseRouter, PageCreateAccount, PageLanguageSelect, PageListSelect) {
    /**
     * @class RouterAccountCreation
     * @extends BaseRouter
     */
    var RouterAccountCreation = BaseRouter.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property routes
         * @type Object
         */
        routes: {
            'getting-started': 'showGettingStarted',
            'getting-started/language-select': 'showLanguageSelect',
            'getting-started/list-select': 'showListSelect',
            'getting-started/signup': 'showSignup'
        },
        /**
         * @method showAccountCreation
         */
        showGettingStarted: function() {
            var self = this;
            if (app.api.isGuestValid()) {
                this.showLanguageSelect();
            } else {
                app.dialogs.show().element('.message-title').text('Authenticating Guest');
                app.api.authenticateGuest(function() {
                    self.showLanguageSelect();
                    app.dialogs.hide();
                }, function() {
                    self.defaultRoute();
                    app.dialogs.hide();
                });
            }
        },
        /**
         * @method showSignup
         */
        showSignup: function() {
            this.currentPage = new PageCreateAccount();
            this.currentPage.render();
        },
        /**
         * @method showLanguageSelect
         */
        showLanguageSelect: function() {
            this.currentPage = new PageLanguageSelect();
            this.currentPage.render();
        },
        /**
         * @method showListSelect
         */
        showListSelect: function() {
            this.currentPage = new PageListSelect();
            this.currentPage.render();
        }
    });

    return RouterAccountCreation;
});