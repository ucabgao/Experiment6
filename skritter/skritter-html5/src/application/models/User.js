/**
 * @module Application
 */
define([
    'framework/BaseModel',
    'collections/data/DataReviews',
    'collections/user/ScheduleItems',
    'models/user/UserData',
    'models/user/UserSettings',
    'models/user/UserStats',
    'models/user/UserSubscription'
], function(BaseModel, DataReviews, ScheduleItems, UserData, UserSettings, UserStats, UserSubscription) {
    /**
     * @class User
     * @extends BaseModel
     */
    var User = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.data = new UserData(null, {user: this});
            this.schedule = new ScheduleItems(null, {user: this});
            this.reviews = new DataReviews(null, {user: this});
            this.settings = new UserSettings(null, {user: this});
            this.stats = new UserStats(null, {user: this});
            this.subscription = new UserSubscription(null, {user: this});
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            id: 'guest'
        },
        /**
         * @method createNew
         * @param {Object} [settings]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        createNew: function(settings, callbackComplete, callbackError) {
            var self = this;
            var lang = app.api.getGuest('lang');
            var list = app.api.getGuest('list');
            var style = app.api.getGuest('style');
            app.dialogs.show().element('.message-title').text('Creating Account');
            async.waterfall([
                function(callback) {
                    if (self.isAuthenticated()) {
                        callback(null, self.settings.toJSON());
                    } else {
                        app.dialogs.element('.message-text').text('CREATING USER');
                        app.api.createUser({
                            lang: lang
                        }, function(user) {
                            callback(null, user);
                        }, function(error) {
                            callback(error);
                        });
                    }
                },
                function(user, callback) {
                    if (self.isAuthenticated()) {
                        callback(null, user);
                    } else {
                        app.dialogs.element('.message-text').text('SIGNING IN');
                        self.login(user.id, '', function() {
                            callback(null, user);
                        }, function(error) {
                            callback(error);
                        });
                    }
                },
                function(user, callback) {
                    app.dialogs.element('.message-text').text('CONFIGURING SETTINGS');
                    if (lang === 'zh') {
                        settings.addSimplified = ['both', 'simp'].indexOf(style) !== -1;
                        settings.addTraditional = ['both', 'trad'].indexOf(style) !== -1;
                        settings.reviewSimplified = ['both', 'simp'].indexOf(style) !== -1;
                        settings.reviewTraditional = ['both', 'trad'].indexOf(style) !== -1;
                    }
                    settings.targetLang = lang;
                    app.api.updateUser($.extend(user, settings), function(settings) {
                        self.set('id', settings.id);
                        self.settings.set(settings);
                        callback(null, user);
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    mixpanel.track('Account Created');
                    callbackComplete();
                }
            });
        },
        /**
         * @method getAvatar
         * @param {Array|String} classes
         * @returns {String}
         */
        getAvatar: function(classes) {
            var avatar = this.settings.get('avatar') ? 'data:image/png;base64,' + this.settings.get('avatar') : 'images/avatars/default.png';
            if (classes) {
                classes = Array.isArray(classes) ? classes.join(' ') : classes;
                return "<img src='" + avatar + "' " + "class='" + classes + "'" + " />";
            } else {
                return "<img src='" + avatar + "' />";
            }
        },
        /**
         * @method getDisplayName
         */
        getDisplayName: function() {
            return this.isRegistered() ? this.settings.get('name') : 'guest';
        },
        /**
         * @method getLanguageCode
         */
        getLanguageCode: function() {
            if (['ja', 'zh'].indexOf(app.get('languageCode')) === -1) {
                return this.settings.get('targetLang');
            }
            return app.get('languageCode');
        },
        /**
         * @method getLanguageName
         */
        getLanguageName: function() {
            return this.isChinese() ? app.strings.global.chinese : app.strings.global.japanese;
        },
        /**
         * @method getFontClass
         * @returns {String}
         */
        getFontClass: function() {
            return this.isChinese() ? 'simkai' : 'kaisho';
        },
        /**
         * @method getServerTime
         * @param {Function} callback
         */
        getServerTime: function(callback) {
            app.api.getDate(function(result) {
                callback(result.serverTime);
            }, function() {
                callback(moment().unix());
            });
        },
        /**
         * @method isAuthenticated
         * @returns {Boolean}
         */
        isAuthenticated: function() {
            return this.id !== 'guest';
        },
        /**
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            return this.getLanguageCode() === 'zh' ? true : false;
        },
        /**
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            return this.getLanguageCode() === 'ja' ? true : false;
        },
        /**
         * @method isRegistered
         * @returns {Boolean}
         */
        isRegistered: function() {
            return this.settings.has('name');
        },
        /**
         * @method load
         * @param {Function} callback
         */
        load: function(callback) {
            var self = this;
            if (localStorage.getItem('_active')) {
                //load localstorage into memory
                this.set('id', localStorage.getItem('_active'));
                if (localStorage.getItem(this.id + '-data')) {
                    this.data.set(JSON.parse(localStorage.getItem(this.id + '-data')), {silent: true});
                }
                if (localStorage.getItem(this.id + '-settings')) {
                    this.settings.set(JSON.parse(localStorage.getItem(this.id + '-settings')), {silent: true});
                }
                if (localStorage.getItem(this.id + '-stats')) {
                    this.stats.set(JSON.parse(localStorage.getItem(this.id + '-stats')), {silent: true});
                }
                if (localStorage.getItem(this.id + '-subscription')) {
                    this.subscription.set(JSON.parse(localStorage.getItem(this.id + '-subscription')), {silent: true});
                }
                //attach raygun reporting based on environment
                if (app.isNative()) {
                    raygun.init('HovAfmmtQxgDLtXszGJ7NA==', {ignoreAjaxAbort: true}).attach();
                } else if (location.host === 'html5.skritter.com') {
                    raygun.init('rzs1L7e4RucNaCmV3aP9Qw==', {ignoreAjaxAbort: true}).attach();
                }
                async.series([
                    //display general loading messaged
                    function(callback) {
                        app.dialogs.show(null, callback).element('.message-title').text('Getting Started');
                        app.dialogs.element('.message-text').text('');
                    },
                    //bind user id to google analytics tracking
                    function(callback) {
                        app.analytics.setUserId(self.settings.get('name'), callback);
                    },
                    //start tracking authenticated user with raygun
                    function(callback) {
                        raygun.setUser(self.settings.get('name'), false, self.settings.get('email'));
                        raygun.setVersion(app.getVersion());
                        raygun.withCustomData(self.settings.getCustomData);
                        raygun.withTags(self.settings.getTags());
                        callback();
                    },
                    //load expansion files from local obb
                    function(callback) {
                        if (plugins.expansion) {
                            var mainVersion = app.get('expansionMainVersion');
                            var patchVersion = app.get('expansionPatchVersion');
                            plugins.expansion.load(mainVersion, patchVersion, function() {
                                callback();
                            }, function() {
                                plugins.expansion = undefined;
                                callback();
                            });
                        } else {
                            callback();
                        }
                    },
                    //load user storage instance
                    function(callback) {
                        app.storage.open(self.id, callback);
                    },
                    //check token expiration and refresh
                    function(callback) {
                        if (self.data.get('expires') - moment().unix() > 604800) {
                            callback();
                        } else {
                            app.dialogs.element('.message-text').text('REFRESHING TOKEN');
                            app.api.refreshToken(self.data.get('refresh_token'), function(data) {
                                self.data.set(data);
                                callback();
                            }, function() {
                                callback();
                            });
                        }
                    },
                    //enable list selected by new users
                    function(callback) {
                        if (app.api.hasGuest() && app.api.getGuest('list') && !app.api.getGuest('enabledList')) {
                            app.dialogs.element('.message-text').text('ENABLING LIST');
                            app.api.updateVocabList({
                                id: app.api.getGuest('list'),
                                studyingMode: 'adding'
                            }, function() {
                                app.api.setGuest('enabledList', true);
                                callback();
                            }, function(error) {
                                callback(error);
                            });
                        } else {
                            callback();
                        }
                    },
                    //added initial items for new users
                    function(callback) {
                        if (app.api.hasGuest() && !app.api.getGuest('addedItems')) {
                            app.dialogs.element('.message-text').text('ADDING ITEMS');
                            self.data.items.fetchNew({get: false, limit: 10}, function() {
                                app.api.setGuest('addedItems', true);
                                callback();
                            }, function(error) {
                                callback(error);
                            });
                        } else {
                            callback();
                        }
                    },
                    //sync items from server
                    function(callback) {
                        if (!self.data.get('lastItemSync') && !self.settings.get('enableJit')) {
                            app.dialogs.element('.message-text').text('REQUESTING DATA');
                            self.data.items.downloadAll(callback, function(error) {
                                callback(error);
                            });
                        } else {
                            callback();
                        }
                    },
                    //update subscription from server
                    function(callback) {
                        if (app.isLocalhost()) {
                            callback();
                        } else {
                            app.dialogs.element('.message-text').text('CHECKING SUBSCRIPTION');
                            app.user.subscription.fetch(function() {
                                callback();
                            });
                        }
                    },
                    //update user from server
                    function(callback) {
                        if (app.isLocalhost()) {
                            callback();
                        } else {
                            app.dialogs.element('.message-text').text('UPDATING USER');
                            app.user.settings.fetch(function() {
                                callback();
                            });
                        }
                    },
                    //load all schedule items
                    function(callback) {
                        app.dialogs.element('.message-text').text('SCHEDULING');
                        self.schedule.loadAll(callback);
                    },
                    //load all vocablists
                    function(callback) {
                        self.data.vocablists.loadAll(callback);
                    },
                    //load all srsconfigs
                    function(callback) {
                        self.data.srsconfigs.loadAll(callback);
                    },
                    //load all reviews
                    function(callback) {
                        self.reviews.loadAll(callback);
                    },
                    //perform initial sync
                    function(callback) {
                        self.data.sync(0, callback, function() {
                            callback();
                        });
                    }
                ], function(error) {
                    if (error) {
                        console.error('USER ERROR:', error);
                        var response = error.responseJSON;
                        try {
                            throw new Error('User Error');
                        } catch (e) {
                            raygun.send(e, {Message: JSON.stringify(error)});
                        }
                        if (response && response.statusCode === 403) {
                            localStorage.removeItem(app.user.id + '-data');
                            localStorage.removeItem(app.user.id + '-settings');
                            localStorage.removeItem(app.user.id + '-stats');
                            localStorage.removeItem(app.user.id + '-subscription');
                            localStorage.removeItem('_active');
                            app.api.clearGuest();
                            app.reload();
                        } else {
                            app.dialogs.element('.message-title').text('Something went wrong.');
                            app.dialogs.element('.message-text').text('Check your connection and click reload.');
                            app.dialogs.element('.message-confirm').html(app.fn.bootstrap.button('Reload', {level: 'primary'}));
                            app.dialogs.element('.message-confirm button').on('vclick', function() {
                                app.reload();
                            });
                        }
                    } else {
                        self.data.startBackgroundSync();
                        app.dialogs.hide(function() {
                            app.router.enableListeners();
                            app.timer.updateOffset();
                            app.api.clearGuest();
                            callback(null, self);
                        });
                    }
                });
            } else {
                callback();
            }
        },
        /**
         * @method login
         * @param {String} username
         * @param {String} password
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        login: function(username, password, callbackComplete, callbackError) {
            var self = this;
            app.api.authenticateUser(username, password, function(data) {
                self.set('id', data.user_id);
                self.data.set(data);
                async.series([
                    function(callback) {
                        self.settings.fetch(callback);
                    },
                    function(callback) {
                        self.subscription.fetch(callback);
                    }
                ], function() {
                    localStorage.setItem('_active', data.user_id);
                    mixpanel.track('Logged In');
                    callbackComplete(data);
                });
            }, function(error) {
                callbackError(error);
            });
        },
        /**
         * @method logout
         * @param {Boolean} [skipDialog]
         */
        logout: function(skipDialog) {
            var self = this;
            if (this.isAuthenticated()) {
                if (skipDialog) {
                    mixpanel.track('Logged Out');
                    this.data.sync(0, function() {
                        self.remove();
                    }, function() {
                        self.remove();
                    });
                } else {
                    app.sidebars.hide();
                    app.dialogs.show('logout');
                    app.dialogs.element('.loader-image').hide();
                    app.dialogs.element('button.logout').on('vclick', function() {
                        app.analytics.trackUserEvent('logging out');
                        app.dialogs.element('button').hide();
                        app.dialogs.element('.modal-header').hide();
                        app.dialogs.element('.loader-image').show();
                        mixpanel.track('Logged Out');
                        self.data.sync(0, function() {
                            self.remove();
                        }, function() {
                            self.remove();
                        });
                    });
                }
            } else {
                app.reload();
            }
        },
        /**
         * @method remove
         */
        remove: function() {
            localStorage.removeItem(app.user.id + '-data');
            localStorage.removeItem(app.user.id + '-settings');
            localStorage.removeItem(app.user.id + '-stats');
            localStorage.removeItem(app.user.id + '-subscription');
            localStorage.removeItem('_active');
            async.series([
                function(callback) {
                    app.storage.destroy(callback);
                }
            ], function() {
                app.api.clearGuest();
                app.reload();
            });
        }
    });

    return User;
});