/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/account.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageAccount
     * @extends BasePage
     */
    var PageAccount = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = app.strings.account.title;
            this.settings = app.user.settings;
            this.sub = app.user.subscription;
        },
        /**
         * @method render
         * @returns {PageAccount}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.elements.accountCountry = this.$('#account-country');
            this.elements.accountDisplayName = this.$('#account-displayname');
            this.elements.accountID = this.$('#account-id');
            this.elements.accountEmail = this.$('#account-email');
            this.elements.accountTimezone = this.$('#account-timezone');
            this.elements.buttonResetAll = this.$('#button-reset-all');
            this.elements.subDetail = this.$('#sub-detail');
            this.elements.subDetailMethod = this.$('#sub-detail-method');
            this.elements.subDetailPlan = this.$('#sub-detail-plan');
            this.elements.subDetailRecurring = this.$('#sub-detail-recurring');
            this.elements.subTrialExpires = this.$('#sub-trial-expires');
            this.elements.subMessage = this.$('#sub-message');
            this.elements.subStatus = this.$('#sub-status');
            this.elements.subButtonMonth = this.$('#subscribe-month');
            this.elements.subButtonYear = this.$('#subscribe-year');
            this.renderElements();
            return this;
        },
        /**
         * @method renderElements
         * @returns {PageAccount}
         */
        renderElements: function() {
            if (this.sub.getRemainingTrial()) {
                this.elements.subStatus.text('Trial').addClass('text-warning');
                this.elements.subTrialExpires.find('span').text(this.sub.get('expires'));
                this.elements.subDetail.hide();
            } else if (this.sub.isExpired()) {
                this.elements.subStatus.text('Expired').addClass('text-danger');
                this.elements.subTrialExpires.hide();
                this.elements.subDetail.hide();
            } else if (this.sub.get('subscribed') && this.sub.get('expires')){
                this.elements.subStatus.text('Active').addClass('text-success');
                this.elements.subDetailMethod.text(this.sub.get('subscribed'));
                this.elements.subDetailPlan.text(this.sub.get('plan'));
                this.elements.subDetailRecurring.text(this.sub.get('expires'));
                this.elements.subTrialExpires.hide();
                this.elements.subButtonMonth.hide();
                this.elements.subButtonYear.hide();
            } else {
                this.elements.subStatus.text('Free').addClass('text-info');
                this.elements.subDetail.hide();
                this.elements.subTrialExpires.hide();
                this.elements.subButtonMonth.hide();
                this.elements.subButtonYear.hide();
            }
            if ([
                    'jaketest1',
                    'mcfarljwtest1',
                    'mcfarljwtest2',
                    'mcfarljwtest3'
                ].indexOf(app.user.settings.get('name')) === -1) {
                this.elements.buttonResetAll.hide();
            } else {
                this.elements.buttonResetAll.show();
            }
            this.elements.accountCountry.val(this.settings.get('country'));
            this.elements.accountID.val(this.settings.get('id'));
            this.elements.accountDisplayName.val(this.settings.get('name'));
            this.elements.accountEmail.val(this.settings.get('email'));
            this.loadTimezones();
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'change .account-general-form input': 'handleGeneralFormChanged',
            'change .account-general-form select': 'handleGeneralFormChanged',
            'vclick #button-download-all': 'handleButtonDownloadAllClicked',
            'vclick #button-reset-all': 'handleButtonResetAllClicked',
            'vclick #button-restore-subscription': 'handleButtonRestoreSubscriptionClicked',
            'vclick #button-save': 'handleButtonSaveClicked',
            'vclick #subscribe-month': 'handleSubscribeMonth',
            'vclick #subscribe-year': 'handleSubscribeYear'
        }),
        /**
         * @method handleButtonDownloadAllClicked
         * @param {Event} event
         */
        handleButtonDownloadAllClicked: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Account', 'click', 'restore_data');
            app.dialogs.show().element('.message-title').text('Restoring Data');
            app.dialogs.element('.message-text').text('');
            app.router.disableListeners();
            app.user.data.items.downloadAll(function() {
                app.reload();
            }, function() {
                app.dialogs.element('.message-title').text('Something went wrong.');
                app.dialogs.element('.message-text').text('Check your connection and click reload.');
                app.dialogs.element('.message-confirm').html(app.fn.bootstrap.button('Reload', {level: 'primary'}));
                app.dialogs.element('.message-confirm button').on('vclick', function() {
                    app.reload();
                });
            });
        },
        /**
         * @method handleButtonResetAllClicked
         * @param {Event} event
         */
        handleButtonResetAllClicked: function(event) {
            event.preventDefault();
            app.analytics.trackEvent('Account', 'click', 'reset_all');
            app.dialogs.show('confirm').element('.modal-title span').text('Reset Account');
            app.dialogs.element('.confirm').on('vclick', function() {
                async.series([
                    function(callback) {
                        app.dialogs.hide(callback);
                    },
                    function(callback) {
                        app.dialogs.show();
                        app.dialogs.element('.message-title').text('Resetting Account');
                        app.api.resetAccount({lang: app.user.getLanguageCode()}, function() {
                            callback();
                        }, function(error) {
                            callback(error);
                        });
                    },
                    function(callback) {
                        app.user.data.items.downloadAll(function() {
                            callback();
                        }, function(error) {
                            callback(error);
                        });
                    }
                ], function(error) {
                    if (error) {
                        app.dialogs.element('.message-title').text('Something went wrong.');
                        app.dialogs.element('.message-text').text('Check your connection and click reload.');
                        app.dialogs.element('.message-confirm').html(app.fn.bootstrap.button('Reload', {level: 'primary'}));
                        app.dialogs.element('.message-confirm button').on('vclick', function() {
                            app.reload();
                        });
                    } else {
                        app.reload();
                    }
                });
            });
        },
        /**
         * @method handleButtonRestoreSubscriptionClicked
         */
        handleButtonRestoreSubscriptionClicked: function() {
            app.analytics.trackEvent('Account', 'click', 'restore_subscription');
            app.dialogs.show().element('.message-title').text('Restoring Subscription');
            app.user.subscription.restoreGoogle(function() {
                app.dialogs.element('.message-title').text('Subscription Restored');
                app.dialogs.element('.loader-image').hide();
                app.dialogs.element('.message-text').text("Please click to reload the application.");
                app.dialogs.element('.message-confirm').html(app.fn.bootstrap.button("Reload", {level: 'primary'}));
                app.dialogs.element('.message-confirm button').on('vclick', function() {
                    app.reload();
                });
            }, function(error) {
                app.dialogs.element('.message-title').text('Subscription Error');
                app.dialogs.element('.loader-image').hide();
                app.dialogs.element('.message-text').text(error);
                app.dialogs.element('.message-close').html(app.fn.bootstrap.button("Close", {level: 'default'}));
                app.dialogs.element('.message-close button').on('vclick', function() {
                    app.dialogs.hide();
                });
            });
        },
        /**
         * @method handleGeneralFormChanged
         * @param {Event} event
         */
        handleGeneralFormChanged: function(event) {
            event.preventDefault();
            var self = this;
            this.settings.set({
                country: this.elements.accountCountry.val(),
                email: this.elements.accountEmail.val(),
                name: this.elements.accountDisplayName.val(),
                timezone: this.elements.accountTimezone.val()
            }).update(function() {
                $.notify('Account updated!', 'success');
            }, function(error) {
                $.notify(error.responseJSON ? error.responseJSON.message : 'Something went wrong!', 'error');
                self.renderElements();
            });
        },
        /**
         * @method handleSubscribeMonth
         */
        handleSubscribeMonth: function() {
            var self = this;
            mixpanel.track('Clicked Subscription', {"Subscription Type": "Monthly"});
            this.sub.subscribeGoogle('one.month.sub', function() {
                mixpanel.track('Completed Subscription', {"Subscription Type": "Monthly"});
                app.reload();
            }, function(error) {
                self.elements.subMessage.addClass('text-danger').text(error);
            });
        },
        /**
         * @method handleSubscribeYear
         */
        handleSubscribeYear: function() {
            var self = this;
            mixpanel.track('Clicked Subscription', {"Subscription Type": "Yearly"});
            this.sub.subscribeGoogle('one.year.sub', function() {
                mixpanel.track('Completed Subscription', {"Subscription Type": "Yearly"});
                app.reload();
            }, function(error) {
                self.elements.subMessage.addClass('text-danger').text(error);
            });
        },
        /**
         * @method loadTimezones
         * @returns {PageAccount}
         */
        loadTimezones: function() {
            var options = [];
            var timezones = moment.tz.names();
            for (var i = 0, length = timezones.length; i < length; i++) {
                var option = "<option value='" + timezones[i] + "'>";
                option += timezones[i] + ' | ' + moment().tz(timezones[i]).format('HH:mm');
                option += "</option>";
                options.push(option);
            }
            this.elements.accountTimezone.html(options);
            this.elements.accountTimezone.val(this.settings.get('timezone'));
            return this;
        }
    });

    return PageAccount;
});