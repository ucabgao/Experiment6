/**
 * @module Application
 */
define([
    'framework/BaseModel',
    'collections/data/DataDecomps',
    'collections/data/DataItems',
    'collections/data/DataParams',
    'collections/data/DataSentences',
    'collections/data/DataSRSConfigs',
    'collections/data/DataStrokes',
    'collections/data/DataVocabs',
    'collections/data/DataVocabLists'
], function(BaseModel, DataDecomps, DataItems, DataParams, DataSentences, DataSRSConfigs, DataStrokes, DataVocabs, DataVocabLists) {
    /**
     * @class UserData
     * @extends BaseModel
     */
    var UserData = BaseModel.extend({
        /**
         * @method initialize
         * @param {User} user
         * @constructor
         */
        initialize: function(attributes, options) {
            this.backgroundSync = undefined;
            this.decomps = new DataDecomps();
            this.items = new DataItems(null, {data: this});
            this.params = new DataParams();
            this.sentences = new DataSentences();
            this.srsconfigs = new DataSRSConfigs();
            this.strokes = new DataStrokes();
            this.syncing = false;
            this.user = options.user;
            this.vocabs = new DataVocabs(null, {data: this});
            this.vocablists = new DataVocabLists();
            this.on('change:access_token', this.updateExpires);
            this.on('change', this.cache);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            access_token: undefined,
            addOffset: 0,
            changedVocabIds: [],
            downloadId: undefined,
            expires: undefined,
            expires_in: undefined,
            lastErrorCheck: 0,
            lastItemSync: 0,
            lastReviewSync: 0,
            lastSRSConfigSync: 0,
            lastVocabUpdate: 0,
            lastVocabSync: 0,
            refresh_token: undefined,
            token_type: undefined,
            user_id: undefined,
            userUpdated: false
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(this.user.id + '-data', JSON.stringify(this.toJSON()));
        },
        /**
         * @method checkAutoAdd
         * @param {Number|String} dueCount
         */
        checkAutoAdd: function(dueCount) {
            if (this.user.settings.get('autoAdd') && app.user.data.vocablists.hasAdding()) {
                var autoAddLimit = this.user.settings.get('autoAddLimit');
                var recentCount = this.user.schedule.getRecentCount();
                if (recentCount < autoAddLimit && (!dueCount || dueCount < 5)) {
                    this.items.fetchNew({limit: 1, lists: app.user.settings.getActiveLists()});
                }
            }
        },
        /**
         * @method flagVocabUpdate
         * @param {String} vocabId
         */
        flagVocabUpdate: function(vocabId) {
            if (this.attributes.changedVocabIds.indexOf(vocabId) === -1) {
                this.attributes.changedVocabIds.push(vocabId);
            }
            this.cache();
        },
        /**
         * @method loadAll
         * @param {Function} [callback]
         */
        loadAll: function(callback) {
            var result = {};
            async.parallel([
                function(callback) {
                    app.storage.getAll('decomps', function(data) {
                        result.Decomps = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('items', function(data) {
                        result.Items = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('sentences', function(data) {
                        result.Sentences = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('srsconfigs', function(data) {
                        result.SRSConfigs = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('strokes', function(data) {
                        result.Strokes = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('vocablists', function(data) {
                        result.VocabLists = data;
                        callback();
                    });
                },
                function(callback) {
                    app.storage.getAll('vocabs', function(data) {
                        result.Vocabs = data;
                        callback();
                    });
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback(result);
                }
            });
        },
        /**
         * @method put
         * @param {Object} result
         * @param {Function} [callback]
         */
        put: function(result, callback) {
            async.series([
                function(callback) {
                    app.storage.putItems('decomps', result.Decomps, callback);
                },
                function(callback) {
                    app.storage.putItems('items', result.Items, callback);
                },
                function(callback) {
                    app.storage.putItems('sentences', result.Sentences, callback);
                },
                function(callback) {
                    app.storage.putItems('srsconfigs', result.SRSConfigs, callback);
                },
                function(callback) {
                    app.storage.putItems('strokes', result.Strokes, callback);
                },
                function(callback) {
                    app.storage.putItems('vocablists', result.VocabLists, callback);
                },
                function(callback) {
                    app.storage.putItems('vocabs', result.Vocabs, callback);
                }
            ], function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method startBackgroundSync
         */
        startBackgroundSync: function() {
            var self = this;
            this.backgroundSync = setInterval(function() {
                self.sync(1);
            }, moment.duration(5, 'minutes').asMilliseconds());
        },
        /**
         * @method stopBackgroundSync
         */
        stopBackgroundSync: function() {
            clearInterval(this.backgroundSync);
            this.backgroundSync = undefined;
        },
        /**
         * @method sync
         * @param {Number} startFrom
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        sync: function(startFrom, callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            if (this.syncing) {
                if (typeof callbackError === 'function') {
                    callbackError('Sync already in progress.');
                }
            } else {
                this.syncing = true;
                console.log('^^^SYNC STARTED:', moment().format('HH:mm:ss YYYY-MM-DD'));
                async.series([
                    function(callback) {
                        self.user.getServerTime(function(time) {
                            now = time;
                            callback();
                        });
                    },
                    function(callback) {
                        app.dialogs.element('.message-text').text('CALCULATING STATS');
                        self.user.stats.sync(function() {
                            self.trigger('sync', true);
                            app.timer.updateOffset();
                            callback();
                        }, callback);
                    },
                    function(callback) {
                        if (self.get('changedVocabIds').length) {
                            app.dialogs.element('.message-text').text('SAVING VOCABS');
                            self.vocabs.putChanged(callback, callback);
                        } else {
                            callback();
                        }
                    },
                    function(callback) {
                        if (self.get('lastVocabUpdate')) {
                            self.set('lastVocabUpdate', now);
                            callback();
                        } else if (now - self.get('lastVocabUpdate') > 86400) {
                            app.dialogs.element('.message-text').text('UPDATING VOCABS');
                            self.vocabs.updateVocabs(callback, callback);
                            callback();
                        } else {
                            callback();
                        }
                    },
                    function(callback) {
                        if (self.user.reviews.length > startFrom) {
                            app.dialogs.element('.message-text').text('POSTING REVIEWS');
                            self.user.reviews.post(startFrom, callback, callback);
                        } else {
                            callback();
                        }
                    },
                    function(callback) {
                        app.dialogs.element('.message-text').text('UPDATING ITEMS');
                        if (self.user.settings.get('enableJit')) {
                            app.user.data.items.syncJit(callback, callback);
                        } else {
                            app.user.data.items.sync(callback, callback);
                        }
                    }
                ], function(error) {
                    self.syncing = false;
                    if (error) {
                        if (error.status === 403) {
                            self.stopBackgroundSync();
                        } else {
                            console.log('^^^SYNC ERROR', error);
                        }
                        if (typeof callbackError === 'function') {
                            callbackError();
                        }
                    } else {
                        app.analytics.trackUserEvent('background sync');
                        console.log('^^^SYNC FINISHED:', moment().format('HH:mm:ss YYYY-MM-DD'));
                        self.trigger('sync', false);
                        if (typeof callbackSuccess === 'function') {
                            callbackSuccess();
                        }
                    }
                });
            }
        },
        /**
         * @method toggleSentences
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        toggleSentences: function(callbackSuccess, callbackError) {
            var self = this;
            var includeSentences = this.user.settings.get('sentences');
            async.series([
                function(callback) {
                    if (includeSentences) {
                        app.dialogs.show('confirm').element('.modal-title').html("<i class='fa fa-exclamation-triangle'></i> Disable Sentences");
                        app.dialogs.element('.modal-message').empty();
                        app.dialogs.element('.modal-message').append("<p>This will download fresh copies of your characters and words without sentences.</p>");
                        app.dialogs.element('.modal-message').append("<p><em>This can take a long time on larger accounts.</em></p>");
                        app.dialogs.element('.confirm').on('vclick', function() {
                            includeSentences = false;
                            app.dialogs.element().off('hide.bs.modal');
                            app.dialogs.hide(callback);
                        });
                    } else {
                        app.dialogs.show('confirm').element('.modal-title').html("<i class='fa fa-exclamation-triangle'></i> Enable Sentences");
                        app.dialogs.element('.modal-message').empty();
                        app.dialogs.element('.modal-message').append("<p>This will download example sentences for all of your characters and words.</p>");
                        app.dialogs.element('.modal-message').append("<p><em>This can take a long time on larger accounts. If you're experiencing issues consider disabled them.</em></p>");
                        app.dialogs.element('.confirm').on('vclick', function() {
                            includeSentences = true;
                            app.dialogs.element().off('hide.bs.modal');
                            app.dialogs.hide(callback);
                        });
                    }
                    app.dialogs.element().on('hide.bs.modal', function() {
                        if (typeof callbackError === 'function') {
                            callbackError();
                        }
                    });
                },
                function(callback) {
                    app.dialogs.show().element('.message-title').text((includeSentences ? 'Enabling' : 'Disabling') + ' Sentences');
                    app.dialogs.element('.message-text').text('');
                    self.user.settings.set('sentences', includeSentences);
                    callback();
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
                        if (typeof callbackError === 'function') {
                            callbackError();
                        }
                    });
                } else {
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            });
        },
        /**
         * @method toggleKana
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        toggleKana: function(callbackSuccess, callbackError) {
            var self = this;
            var studyKana = this.user.settings.get('studyKana');
            async.series([
                function(callback) {
                    if (studyKana) {
                        app.dialogs.show('confirm').element('.modal-title').html("<i class='fa fa-exclamation-triangle'></i> Disable Kana Support <small>BETA</small>");
                        app.dialogs.element('.modal-message').empty();
                        app.dialogs.element('.modal-message').append("<p>Disabling this settings will require your account to perform a refresh.</p>");
                        app.dialogs.element('.modal-message').append("<p class='text-muted'>SUPPORT: josh@skritter.com</p>");
                        app.dialogs.element('.confirm').on('vclick', function() {
                            app.dialogs.element().off('hide.bs.modal');
                            app.dialogs.hide(callback);
                        });
                    } else {
                        app.dialogs.show('confirm').element('.modal-title').html("<i class='fa fa-exclamation-triangle'></i> Enable Kana Support <small>BETA</small>");
                        app.dialogs.element('.modal-message').empty();
                        app.dialogs.element('.modal-message').append("<p>Start writing words as they exist in their entirety with kanji and kana together at last. Enabling this setting will refresh account data to include kana writing elements for relevant vocab items.</p>");
                        app.dialogs.element('.modal-message').append("<p>This is a beta feature so we'll continue to make upgrades and improvements. You can disable kana writing at any time from the Settings menu.</p>");
                        app.dialogs.element('.modal-message').append("<p class='text-muted'>SUPPORT: josh@skritter.com</p>");
                        app.dialogs.element('.confirm').on('vclick', function() {
                            app.dialogs.element().off('hide.bs.modal');
                            app.dialogs.hide(callback);
                        });
                    }
                    app.dialogs.element().on('hide.bs.modal', function() {
                        if (typeof callbackError === 'function') {
                            callbackError();
                        }
                    });
                },
                function(callback) {
                    studyKana = !studyKana;
                    app.dialogs.show().element('.message-title').text((studyKana ? 'Enabling' : 'Disabling') + ' Kana');
                    app.dialogs.element('.message-text').text('');
                    self.user.settings.set('studyKana', studyKana).update(function() {
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
                        if (typeof callbackError === 'function') {
                            callbackError();
                        }
                    });
                } else {
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            });
        },
        /**
         * @method updateExpires
         */
        updateExpires: function() {
            this.set('expires', moment().unix() + this.get('expires_in'));
        }
    });

    return UserData;
});