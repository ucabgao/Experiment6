/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class ScheduleItem
     * @extends BaseModel
     */
    var ScheduleItem = BaseModel.extend({
        /**
         * @property idAttribute
         * @type String
         */
        idAttribute: 'id',
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            interval: 0,
            last: 0,
            next: 0,
            reviews: 0,
            sectionIds: [],
            successes: 0,
            vocabIds: [],
            vocabListIds: []
        },
        /**
         * @method getBase
         * @returns {String}
         */
        getBase: function() {
            return this.id.split('-')[2];
        },
        /**
         * @method getReadiness
         * @param {Number} [now]
         * @returns {Number}
         */
        getReadiness: function(now) {
            now = now || moment().unix();
            var readiness = 0;
            var offset = 0;
            if (this.attributes.part === 'rune') {
                offset += 30;
            } else if (this.attributes.part === 'tone') {
                offset += 15;
            }
            if (this.attributes.last) {
                if (this.attributes.next >= now && this.attributes.last > now - 600) {
                    readiness -= this.attributes.last + offset;
                } else {
                    readiness = (now - this.attributes.last + offset) / (this.attributes.next - this.attributes.last);
                }
            } else {
                readiness = 9999 + offset;
            }
            return readiness;
        },
        /**
         * @method isNew
         * @returns {Boolean}
         */
        isNew: function() {
            return this.get('reviews') === 0;
        },
        /**
         * @method load
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            var part = self.get('part');
            var result = {};
            async.series([
                //initial item
                function(callback) {
                    app.storage.getItems('items', self.id, function(items) {
                        if (items.length > 0) {
                            result.item = app.user.data.items.add(items[0], {merge: true, silent: true, sort: false});
                            callback();
                        } else {
                            callback('Initial item is missing.');
                        }
                    });
                },
                //initial vocab
                function(callback) {
                    app.storage.getItems('vocabs', result.item.get('vocabIds'), function(vocabs) {
                        if (vocabs.length > 0) {
                            app.user.data.vocabs.add(vocabs, {merge: true, silent: true, sort: false});
                            result.vocab = result.item.getVocab();
                            if (result.vocab && Object.keys(result.vocab.get('definitions')).length) {
                                callback();
                            } else {
                                callback('Initial vocab is missing a definition.');
                            }
                        } else {
                            callback('Initial vocabs are missing.');
                        }
                    });
                },
                //contained items
                function(callback) {
                    var containedItemIds = result.vocab.getContainedItemIds(part, true);
                    if (['rune', 'tone'].indexOf(part) > -1 && containedItemIds.length) {
                        app.storage.getItems('items', containedItemIds, function(containedItems) {
                            result.containedItems = app.user.data.items.add(containedItems, {merge: true, silent: true, sort: false});
                            if (containedItemIds.length === containedItems.length) {
                                callback();
                            } else {
                                callback('One or more of the contained items is missing.');
                            }
                        });
                    } else {
                        result.containedItems = [];
                        callback();
                    }
                },
                //contained vocabs
                function(callback) {
                    var containedVocabIds = result.vocab.getContainedVocabIds(app.user.isJapanese());
                    if (['rune', 'tone'].indexOf(part) > -1 && containedVocabIds.length) {
                        app.storage.getItems('vocabs', containedVocabIds, function(containedVocabs) {
                            if (containedVocabIds.length === containedVocabs.length) {
                                result.containedVocabs = app.user.data.vocabs.add(containedVocabs, {merge: true, silent: true, sort: false});
                                callback();
                            } else {
                                callback('One or more of the contained vocabs is missing.');
                            }
                        });
                    } else {
                        result.containedVocabs = [];
                        callback();
                    }
                },
                //sentences
                function(callback) {
                    if (result.vocab.has('sentenceId')) {
                        app.storage.getItems('sentences', result.vocab.get('sentenceId'), function(sentences) {
                            if (sentences.length > 0) {
                                result.sentences = app.user.data.sentences.add(sentences, {merge: true, silent: true, sort: false});
                                callback();
                            } else {
                                callback('Sentence is missing.');
                            }
                        });
                    } else {
                        result.sentences = [];
                        callback();
                    }
                },
                //strokes
                function(callback) {
                    if (part === 'rune') {
                        var strokeWritings = null;
                        if (result.containedVocabs.length === 0) {
                            strokeWritings = [result.vocab.get('writing')];
                        } else {
                            strokeWritings = _.pluck(result.containedVocabs, function(vocab) {
                                return vocab.attributes.writing;
                            });
                        }
                        strokeWritings = strokeWritings.filter(function(writing) {
                            return !app.fn.isKana(writing);
                        });
                        app.storage.getItems('strokes', strokeWritings, function(strokes) {
                            if (strokeWritings.length === strokes.length) {
                                result.strokes = app.user.data.strokes.add(strokes, {merge: true, silent: true, sort: false});
                                callback();
                            } else {
                                callback('One or more of the strokes are missing.');
                            }
                        });
                    } else {
                        result.strokes = [];
                        callback();
                    }
                },
                //decomps
                function(callback) {
                    var strokeWritings = null;
                    if (result.containedVocabs.length === 0) {
                        strokeWritings = result.vocab.get('writing');
                    } else {
                        strokeWritings = _.pluck(result.containedVocabs, function(vocab) {
                            return vocab.attributes.writing;
                        });
                    }
                    app.storage.getItems('decomps', strokeWritings, function(decomps) {
                        if (strokeWritings.length === decomps.length) {
                            result.decomps = app.user.data.decomps.add(decomps, {merge: true, silent: true, sort: false});
                            callback();
                        } else {
                            result.decomps = [];
                            callback();
                        }
                    });
                }
            ], function(error) {
                if (error) {
                    console.error('SCHEDULE ERROR:', error, self);
                    if (result.item) {
                        self.set({vocabIds: [], flag: error ? error : 'Unable to load item.'});
                        result.item.set({
                            flag: error ? error : 'Unable to load item.',
                            vocabIds: []
                        }).cache(function() {
                            callbackError(error);
                        });
                    } else {
                        callbackError(error);
                    }
                } else {
                    callbackSuccess(result);
                }
            });
        }
    });

    return ScheduleItem;
});