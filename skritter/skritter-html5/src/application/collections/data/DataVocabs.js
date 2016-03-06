/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataVocab'
], function(BaseCollection, DataVocab) {
    /**
     * @class DataVocabs
     * @extend BaseCollection
     */
    var DataVocabs = BaseCollection.extend({
        /**
         * @method initialize
         * @param {Array} models
         * @param {Object} options
         * @constructor
         */
        initialize: function(models, options) {
            this.data = options.data;
            this.on('change', function(vocab) {
                vocab.cache();
            });
        },
        /**
         * @property model
         * @type DataVocab
         */
        model: DataVocab,
        /**
         * @method cache
         * @param {Function} [callback]
         */
        cache: function(callback) {
            app.storage.putItems('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getAll('vocabs', function(data) {
                self.reset();
                self.lazyAdd(data, callback);
            });
        },
        /**
         * @method putChanged
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        putChanged: function(callbackSuccess, callbackError) {
            var self = this;
            var changedVocabIds = self.data.get('changedVocabIds');
            var resultStarted = 0;
            var resultFinished = 0;
            if (changedVocabIds && changedVocabIds.length) {
                async.waterfall([
                    //fetch locally stored vocabs
                    function(callback) {
                        app.storage.getItems('vocabs', changedVocabIds, function(vocabs) {
                            callback(null, vocabs);
                        });
                    },
                    //update vocab directly to server
                    function(vocabs, callback) {
                        app.dialogs.element('.message-text').text('UPDATING VOCABS');
                        app.api.updateVocabs(vocabs, function(updated) {
                            changedVocabIds = _.difference(changedVocabIds, updated);
                            callback();
                        }, function(error) {
                            callback(error);
                        }, function(result) {
                            if (result && result.length) {
                                self.data.user.schedule.insert(result.Items);
                            }
                            resultStarted++;
                            self.data.put(result, function() {
                                resultFinished++;
                            });
                        });
                    },
                    //wait for database put operation to finish
                    function(callback) {
                        (function wait() {
                            if (resultStarted === resultFinished) {
                                callback();
                            } else {
                                setTimeout(wait, 1000);
                            }
                        })();
                    }
                ], function(error) {
                    if (error) {
                        callbackError();
                    } else {
                        self.data.set('changedVocabIds', changedVocabIds);
                        callbackSuccess();
                    }
                });
            } else {
                callbackSuccess();
            }
        },
        /**
         * @method sync
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        sync: function(callbackSuccess, callbackError) {},
        /**
         * @method updateVocabs
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        updateVocabs: function(callbackSuccess, callbackError) {
            var self = this;
            var now = moment().unix();
            var offset = moment(this.data.get('lastVocabUpdate') * 1000).subtract(1, 'day').format('YYYY-MM-DD');
            async.waterfall([
                function(callback) {
                    self.data.user.getServerTime(function(time) {
                        now = time;
                        callback();
                    });
                },
                function(callback) {
                    app.api.getVocabUpdates(offset, null, function(updates) {
                        var bases = [];
                        var langProp = app.user.isChinese() ? 'zhBases' : 'jaBases';
                        for (var a = 0, lengthA = updates.length; a < lengthA; a++) {
                            bases = bases.concat(updates[a][langProp]);
                        }
                        callback(null, _.uniq(bases));
                    }, function(error) {
                        callback(error);
                    });
                },
                function(bases, callback) {
                    app.storage.getVocabIdByBase(bases, function(vocabIds) {
                        callback(null, vocabIds);
                    });
                },
                function(vocabIds, callback) {
                    app.api.getVocabById(vocabIds, null, function(result) {
                        self.data.put(result, function() {
                            callback();
                        });
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function(error) {
                if (error) {
                    callbackError();
                } else {
                    self.data.set('lastVocabUpdate', now);
                    callbackSuccess();
                }
            });
        }
    });

    return DataVocabs;
});
