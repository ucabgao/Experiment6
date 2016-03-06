/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataItem'
], function(BaseCollection, DataItem) {
    /**
     * @class DataItems
     * @extend BaseCollection
     */
    var DataItems = BaseCollection.extend({
        /**
         * @method initialize
         * @param {Array} models
         * @param {Object} options
         * @constructor
         */
        initialize: function(models, options) {
            this.data = options.data;
        },
        /**
         * @property model
         * @type DataItem
         */
        model: DataItem,
        /**
         * @method downloadAll
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        downloadAll: function(callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            var resultStarted = 0;
            var resultFinished = 0;
            async.series([
                //use server time for reference
                function(callback) {
                    self.data.user.getServerTime(function(time) {
                        now = time;
                        callback();
                    });
                },
                //load all not synced local reviews
                function(callback) {
                    self.data.user.reviews.loadAll(callback);
                },
                //submit all reviews before clearing data
                function(callback) {
                    self.data.user.reviews.post(0, function() {
                        callback();
                    }, function() {
                        callback();
                    });
                },
                //clear all locally stored data
                function(callback) {
                    localStorage.removeItem(app.user.id + '-stats');
                    app.storage.clearAll(callback);
                },
                //send batch request to fetch all data
                function(callback) {
                    if (self.data.get('downloadId')) {
                        callback();
                    } else {
                        app.api.requestBatch([
                            {
                                path: 'api/v' + app.api.get('version') + '/items',
                                method: 'GET',
                                params: {
                                    lang: app.user.getLanguageCode(),
                                    sort: 'changed',
                                    offset: 0,
                                    include_vocabs: 'true',
                                    include_sentences: 'false',
                                    include_strokes: 'true',
                                    include_heisigs: 'true',
                                    include_top_mnemonics: 'false',
                                    include_decomps: 'true'
                                },
                                spawner: true
                            },
                            {
                                path: 'api/v' + app.api.get('version') + '/srsconfigs',
                                method: 'GET',
                                params: {
                                    lang: app.user.getLanguageCode()
                                }
                            },
                            {
                                path: 'api/v' + app.api.get('version') + '/vocablists',
                                method: 'GET',
                                params: {
                                    lang: app.user.getLanguageCode(),
                                    sort: 'studying'
                                }
                            }
                        ], function(result) {
                            self.data.set('downloadId', result.id);
                            callback();
                        }, function(error) {
                            callback(error);
                        });
                    }
                },
                //check status of download on server
                function(callback) {
                    app.api.checkBatch(self.data.get('downloadId'), function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    }, function(result) {
                        app.dialogs.element('.message-text').text('ASSEMBLING: ' + app.fn.convertBytesToSize(result.responseSize));
                    });
                },
                //download all item from server in chunks
                function(callback) {
                    app.api.getBatch(self.data.get('downloadId'), function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    }, function(result) {
                        var percent = Math.floor((result.downloadedRequests / result.totalRequests) * 100);
                        app.dialogs.element('.message-text').text('FETCHING: ' + percent + '%');
                        resultStarted++;
                        self.data.put(result, function() {
                            resultFinished++;
                        });
                    });
                },
                //wait for database put operation to finish
                function(callback) {
                    (function wait() {
                        if (resultFinished >= resultStarted) {
                            callback();
                        } else {
                            setTimeout(wait, 1000);
                        }
                    })();
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    self.data.set({
                        downloadId: undefined,
                        lastErrorCheck: now,
                        lastItemSync: now,
                        lastReviewSync: now,
                        lastSRSConfigSync: now,
                        lastVocabSync: now,
                        lastVocabUpdate: now
                    });
                    callbackSuccess();
                }
            });
        },
        /**
         * @method fetchNew
         * @param {Object} [options]
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetchNew: function(options, callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            var items = [];
            var numVocabsAdded = 0;
            var result = {};
            var vocablists = [];
            options = options ? options : {};
            options.get = options.get === undefined ?  true : options.get;
            options.limit = options.limit === undefined ? 1 : options.limit;
            options.lists = options.lists === undefined ? undefined : options.lists.join('|');
            if (self.data.syncing) {
                if (typeof callbackError === 'function') {
                    callbackError('Sync already in progress.');
                }
            } else {
                self.data.syncing = true;
                async.series([
                    //use server time for reference
                    function(callback) {
                        app.api.checkConnection(function(time) {
                            self.data.trigger('sync', true);
                            now = moment(time * 1000).subtract(1, 'minute').unix();
                            callback();
                        }, callback);
                    },
                    //make initial request for new items
                    function (callback) {
                        async.waterfall([
                            //request new items via api batch
                            function(callback) {
                                $.notify('Looking for ' + options.limit + (options.limit === 1 ? ' word' : ' words') + '.', {
                                    className: 'info',
                                    globalPosition: 'top right'
                                });
                                app.api.requestBatch([
                                    {
                                        path: 'api/v' + app.api.get('version') + '/items/add',
                                        method: 'POST',
                                        params: {
                                            lang: app.user.getLanguageCode(),
                                            limit: options.limit,
                                            lists: options.lists,
                                            offset: self.get('addOffset')
                                        }
                                    }
                                ], function(result) {
                                    callback(null, result);
                                }, function(error) {
                                    callback(error);
                                });
                            },
                            //check batch until server finish processing
                            function(batch, callback) {
                                app.api.checkBatch(batch.id, function() {
                                    callback(null, batch);
                                }, function(error) {
                                    callback(error);
                                });
                            },
                            //fetch items that have been added
                            function(batch, callback) {
                                app.api.getBatch(batch.id, function() {
                                    callback();
                                }, function(error) {
                                    callback(error);
                                }, function(result) {
                                    if (result.Items && result.Items.length) {
                                        items = items.concat(result.Items);
                                    }
                                    if (result.numVocabsAdded) {
                                        numVocabsAdded += result.numVocabsAdded;
                                    }
                                    if (result.VocabLists && result.VocabLists.length) {
                                        vocablists = vocablists.concat(result.VocabLists);
                                    }
                                });
                            },
                        ], callback);
                    },
                    //sync items changed since items were added
                    function(callback) {
                        if (options.get) {
                            if (items && items.length) {
                                app.api.getItemByOffset(now, {
                                    lang: app.user.getLanguageCode(),
                                    includeVocabs: true,
                                    includeStrokes: true,
                                    includeHeisigs: true,
                                    includeDecomps: true
                                }, function(result) {
                                    if (result.Items && result.Items.length) {
                                        self.data.user.schedule.insert(result.Items);
                                    }
                                    self.data.put(result, callback);
                                }, function(error) {
                                    callback(error);
                                });
                            } else {
                                app.api.getVocabLists({
                                    lang: app.user.getLanguageCode(),
                                    sort: 'studying'
                                }, function(result) {
                                    self.data.vocablists.add(result, {merge: true});
                                    callback('No items found.');
                                }, callback);
                            }
                        } else {
                            callback();
                        }
                    }
                ], function(error) {
                    self.data.syncing = false;
                    if (error) {
                        console.log('VOCABLISTS', vocablists);
                        console.log('ITEM ADD ERROR:', error);
                        self.data.trigger('sync', self.data.syncing);
                        if (typeof callbackError === 'function') {
                            callbackError(error);
                        }
                    } else {
                        app.analytics.trackUserEvent('added_items', items.length);
                        mixpanel.track('Added New Words', {'Number Added': numVocabsAdded.length});
                        console.log('ITEMS', items, vocablists, numVocabsAdded);
                        self.data.set('addOffset', self.data.get('addOffset') + numVocabsAdded);
                        self.data.vocablists.add(vocablists, {merge: true});
                        self.data.user.schedule.updateFilter();
                        result.items = items;
                        result.numVocabsAdded = numVocabsAdded;
                        result.vocablists = vocablists;
                        self.data.trigger('sync', self.data.syncing);
                        $.notify('Added ' + result.numVocabsAdded + (result.numVocabsAdded === 1 ? ' word' : ' words') + '.', {
                            className: 'success',
                            globalPosition: 'top right'
                        });
                        if (typeof callbackSuccess === 'function') {
                            callbackSuccess(result);
                        }
                    }
                });
            }
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getAll('items', function(data) {
                self.reset();
                self.lazyAdd(data, callback, {silent: true});
            });
        },
        /**
         * @method sync
         * @param {Function} callbackSuccess
         * @param {Function} [callbackError]
         */
        sync: function(callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            var includeSentences = app.user.settings.get('sentences');
            async.series([
                //use server time for reference
                function(callback) {
                    self.data.user.getServerTime(function(time) {
                        now = time;
                        callback();
                    });
                },
                //fetch items based on last offset value
                function(callback) {
                    app.api.getItemByOffset(self.data.get('lastItemSync'), {
                        lang: app.user.getLanguageCode(),
                        includeDecomps: true,
                        includeHeisigs: true,
                        includeSentences: false,
                        includeStrokes: true,
                        includeVocabs: true
                    }, function(result) {
                        if (result.Items && result.Items.length) {
                            self.data.user.schedule.insert(result.Items);
                        }
                        self.data.put(result, function() {
                            callback();
                        });
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    self.data.set('lastItemSync', now);
                    callbackSuccess();
                }
            });
        },
        /**
         * @method syncJit
         * @param {Function} callbackSuccess
         * @param {Function} [callbackError]
         */
        syncJit: function(callbackSuccess, callbackError) {
            var self = this;
            async.series([
                //fetch items based on last offset value
                function(callback) {
                    app.api.getItemByNext({lang: app.user.getLanguageCode()}, function(result) {
                        if (result.Items && result.Items.length) {
                            self.data.user.schedule.insert(result.Items);
                        }
                        if (result.ContainedItems && result.ContainedItems.length) {
                            result.Items = result.Items.concat(result.ContainedItems);
                        }
                        self.data.put(result, function() {
                            callback();
                        });
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    callbackSuccess();
                }
            });
        }
    });

    return DataItems;
});