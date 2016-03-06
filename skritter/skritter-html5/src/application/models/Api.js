/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class Api
     * @extend BaseModel
     */
    var Api = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            if (JSON.parse(localStorage.getItem('_guest'))) {
                this.set('guest', JSON.parse(localStorage.getItem('_guest')), {silent: true});
            }
            this.on('change:guest', this.cache);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            clientId: 'skritterandroid',
            clientSecret: 'dc912c037002a7dd35dd651f0b5074',
            guest: undefined,
            root: 'https://www.skritter',
            timeout: 100,
            tld: location.host.indexOf('.cn') === -1 ? '.com' : '.cn',
            version: 0
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem('_guest', JSON.stringify(this.toJSON().guest));
        },
        /**
         * @method authenticateGuest
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        authenticateGuest: function(callbackComplete, callbackError) {
            $.ajax({
                url: this.getBaseUrl() + 'oauth2/token',
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST',
                data: {
                    grant_type: 'client_credentials',
                    client_id: this.get('clientId')
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    data.expires = moment().unix() + data.expires_in;
                    this.set('guest', data);
                    callbackComplete(data);
                } else {
                    callbackError(data);
                }

            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method addMissing
         * @param {Array|String} vocabIds
         * @param {Object} [options]
         * @param {Function} [callbackComplete]
         * @param {Function} [callbackError]
         * @param {Function} [callbackResult]
         */
        addMissing: function(vocabIds, options, callbackComplete, callbackError, callbackResult) {
            var self = this;
            vocabIds = Array.isArray(vocabIds) ? vocabIds : [vocabIds];
            (function next() {
                $.ajax({
                    url: self.getBaseUrl() + 'items/addmissing' +
                    '?bearer_token=' + self.getToken() +
                    '&vocabId=' + vocabIds.splice(0, 1)[0],
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'POST'
                }).done(function(data) {
                    if (data.statusCode === 200) {
                        delete data.statusCode;
                        if (typeof callbackResult === 'function') {
                            callbackResult(data);
                        }
                        if (vocabIds.length) {
                            setTimeout(next, this.timeout);
                        } else {
                            callbackComplete();
                        }

                    } else {
                        callbackError(data);
                    }
                }).fail(function(error) {
                    callbackError(error);
                });
            })();
        },
        /**
         * @method authenticateUser
         * @param {String} username
         * @param {String} password
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        authenticateUser: function(username, password, callbackComplete, callbackError) {
            $.ajax({
                url: this.getBaseUrl() + 'oauth2/token',
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST',
                data: {
                    grant_type: 'password',
                    client_id: this.get('clientId'),
                    username: username,
                    password: password
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method beforeSend
         * @param {jqXHR} xhr
         */
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', this.getCredentials());
        },
        /**
         * @method getBatch
         * @param {String} batchId
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         * @param {Function} [callbackResult]
         */
        checkBatch: function(batchId, callbackComplete, callbackError, callbackResult) {
            var self = this;
            (function wait() {
                $.ajax({
                    url: self.getBaseUrl() + 'batch/' + batchId + '/status',
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'GET',
                    data: {
                        bearer_token: self.getToken(),
                        detailed: true
                    }
                }).done(function(data) {
                    if (data.Batch && data.statusCode === 200) {
                        data.Batch.responseSize = app.fn.addAllObjectAttributes(data.Batch.Requests, 'responseSize');
                        if (data.Batch.runningRequests > 0) {
                            if (typeof callbackResult === 'function') {
                                callbackResult(data.Batch);
                            }
                            setTimeout(wait, 5000);
                        } else {
                            if (typeof callbackResult === 'function') {
                                callbackResult(data.Batch);
                            }
                            callbackComplete(_.pluck(data.Batch.Requests, 'id'));
                        }
                    } else {
                        callbackError(data);
                    }
                }).fail(function(error) {
                    callbackError(error);
                });
            })();
        },
        /**
         * @method checkConnection
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        checkConnection: function(callbackComplete, callbackError) {
            this.getDate(function(result) {
                callbackComplete(result.serverTime);
            }, function(error) {
                callbackError(error);
            });
        },
        /**
         * @method clearGuest
         */
        clearGuest: function() {
            this.set('guest', false);
            localStorage.removeItem('_guest');
        },
        /**
         * @method createUser
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        createUser: function(options, callbackComplete, callbackError) {
            options = options ? options : {};
            $.ajax({
                url: this.getBaseUrl() + 'users',
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST',
                data: {
                    bearer_token: this.getToken(),
                    fields: options.fields,
                    lang: options.lang
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data.User);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method createVocabList
         * @param {Object} list
         * @param {Function} callbackComplete
         * @param {Function} [callbackError]
         */
        createVocabList: function(list, callbackComplete, callbackError) {
            $.ajax({
                url: this.getBaseUrl()  + 'vocablists?bearer_token=' + this.getToken(),
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST',
                data: JSON.stringify(list)
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data.VocabList);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method getBaseUrl
         * @returns {String}
         */
        getBaseUrl: function() {
            return this.get('root') + this.get('tld') + '/api/v' + this.get('version') + '/';
        },
        /**
         * @method getBatch
         * @param {String} batchId
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         * @param {Function} callbackResult
         */
        getBatch: function(batchId, callbackComplete, callbackError, callbackResult) {
            var self = this;
            var downloadedRequests = 0;
            var batchSize = 19;
            async.waterfall([
                function(callback) {
                    self.checkBatch(batchId, function(requestIds) {
                        callback(null, requestIds);
                    }, function(error) {
                        callback(error);
                    });
                },
                function(requestIds, callback) {
                    (function download() {
                        $.ajax({
                            url: self.getBaseUrl() + 'batch/' + batchId,
                            beforeSend: self.beforeSend,
                            context: self,
                            type: 'GET',
                            data: {
                                bearer_token: self.getToken(),
                                request_ids: requestIds.slice(0, batchSize).join(',')
                            }
                        }).done(function(data) {
                            var result = {};
                            result.responseSize = 0;
                            if (data.statusCode === 200) {
                                for (var i = 0, length = data.Batch.Requests.length; i < length; i++) {
                                    if (typeof data.Batch.Requests[i].response === 'object') {
                                        result = app.fn.mergeObjectArrays(result, data.Batch.Requests[i].response);
                                        result.responseSize += data.Batch.Requests[i].responseSize;
                                    }
                                    downloadedRequests++;
                                }
                                if (result && result.statusCode === 200) {
                                    delete result.cursor;
                                    delete result.statusCode;
                                    result.downloadedRequests = downloadedRequests;
                                    result.totalRequests = data.Batch.totalRequests;
                                    requestIds.splice(0, batchSize);
                                    callbackResult(result);
                                    if (requestIds.length > 0) {
                                        setTimeout(download, self.get('timeout'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callbackError(result);
                                }
                            } else {
                                callback(data);
                            }
                        }).fail(function(error) {
                            callback(error);
                        });
                    })();
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackComplete();
                }
            });
        },
        /**
         * @method getCredentials
         * @returns {String}
         */
        getCredentials: function() {
            return 'basic ' + btoa(this.get('clientId') + ':' + this.get('clientSecret'));
        },
        /**
         * @method getDate
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getDate: function(callbackComplete, callbackError) {
            $.ajax({
                url: this.getBaseUrl() + 'dateinfo',
                beforeSend: this.beforeSend,
                context: this,
                type: 'GET',
                data: {
                    bearer_token: this.getToken()
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    delete data.statusCode;
                    callbackComplete(data);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method getGuest
         * @param {String} key
         * @returns {Object}
         */
        getGuest: function(key) {
            return this.get('guest') ? this.get('guest')[key] : undefined;
        },
        /**
         * @method getItemById
         * @param {Array|String} itemIds
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getItemById: function(itemIds, options, callbackComplete, callbackError) {
            var self = this;
            var result = {};
            options = options ? options : {};
            itemIds = _.uniq(Array.isArray(itemIds) ? itemIds : [itemIds]);
            (function next() {
                $.ajax({
                    url: self.getBaseUrl() + 'items',
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'GET',
                    data: {
                        bearer_token: self.getToken(),
                        lang: options.lang || app.user.getLanguageCode(),
                        ids: itemIds.splice(0, 19).join('|'),
                        fields: options.fields,
                        include_decomps: options.includeDecomps ? 'true' : 'false',
                        include_heisigs: options.includeHeisigs ? 'true' : 'false',
                        include_strokes: options.includeStrokes ? 'true' : 'false',
                        include_sentences: options.includeSentences ? 'true' : 'false',
                        include_top_mnemonics: options.includeTopMnemonics ? 'true' : 'false',
                        include_vocabs: options.includeVocabs ? 'true' : 'false'
                    }
                }).done(function(data) {
                    if (data.statusCode === 200) {
                        delete data.statusCode;
                        result = app.fn.mergeObjectArrays(result, data);
                        if (itemIds.length > 0) {
                            setTimeout(next, self.timeout);
                        } else {
                            callbackComplete(result);
                        }
                    } else {
                        callbackError(data);
                    }
                }).fail(function(error) {
                    callbackError(error);
                });
            })();
        },
        /**
         * @method getItemByOffset
         * @param {Array|String} itemIds
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getItemByOffset: function(offset, options, callbackComplete, callbackError) {
            var self = this;
            var result = {};
            options = options ? options : {};
            (function next(cursor) {
                $.ajax({
                    url: self.getBaseUrl() + 'items',
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'GET',
                    data: {
                        bearer_token: self.getToken(),
                        lang: options.lang || app.user.getLanguageCode(),
                        cursor: cursor,
                        sort: 'changed',
                        offset: offset,
                        fields: options.fields,
                        include_decomps: options.includeDecomps ? 'true' : 'false',
                        include_heisigs: options.includeHeisigs ? 'true' : 'false',
                        include_strokes: options.includeStrokes ? 'true' : 'false',
                        include_sentences: options.includeSentences ? 'true' : 'false',
                        include_top_mnemonics: options.includeTopMnemonics ? 'true' : 'false',
                        include_vocabs: options.includeVocabs ? 'true' : 'false'
                    }
                }).done(function(data) {
                    if (data.statusCode === 200) {
                        delete data.statusCode;
                        result = app.fn.mergeObjectArrays(result, data);
                        if (data.cursor) {
                            setTimeout(next, self.timeout, data.cursor);
                        } else {
                            callbackComplete(result);
                        }
                    } else {
                        callbackError(data);
                    }
                }).fail(function(error) {
                    callbackError(error);
                });
            })();
        },
        /**
         * @method getItemByNext
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getItemByNext: function(options, callbackComplete, callbackError) {
            options = options === undefined ? {} : options;
            $.ajax({
                url: this.getBaseUrl() + 'items',
                beforeSend: this.beforeSend,
                context: this,
                type: 'GET',
                data: {
                    bearer_token: this.getToken(),
                    lang: options.lang || app.user.getLanguageCode(),
                    sort: 'next',
                    include_contained: 'true',
                    include_decomps: 'true',
                    include_heisigs: 'true',
                    include_strokes: 'true',
                    include_sentences: 'false',
                    include_top_mnemonics: 'false',
                    include_vocabs: 'true'
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    delete data.cursor;
                    delete data.statusCode;
                    callbackComplete(data);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method getReviewErrors
         * @param {Number} [offset]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getReviewErrors: function(offset, callbackComplete, callbackError) {
            var self = this;
            var errors = [];
            (function next(cursor) {
                $.ajax({
                    url: self.getBaseUrl() + 'reviews/errors',
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'GET',
                    data: {
                        bearer_token: self.getToken(),
                        cursor: cursor,
                        offset: offset
                    }
                }).done(function(data) {
                    errors = errors.concat(data.ReviewErrors);
                    if (data.statusCode === 200) {
                        if (data.cursor) {
                            setTimeout(next, self.timeout, data.cursor);
                        } else {
                            callbackComplete(errors);
                        }
                    } else {
                        callbackError(data);
                    }
                }).fail(function(error) {
                    callbackError(error);
                });
            })();
        },
        /**
         * @method getStats
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getStats: function(options, callbackComplete, callbackError) {
            options = options ? options : {};
            options.start = options.start ? options.start : moment().format('YYYY-MM-DD');
            $.ajax({
                url: this.getBaseUrl() + 'progstats',
                beforeSend: this.beforeSend,
                context: this,
                type: 'GET',
                data: {
                    bearer_token: this.getToken(),
                    lang: options.lang || app.user.getLanguageCode(),
                    start: options.start,
                    end: options.end,
                    step: options.step,
                    fields: options.fields
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data.ProgressStats);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method getUserSubscription
         * @param {String} userId
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getSubscription: function(userId, options, callbackComplete, callbackError) {
            options = options ? options : {};
            $.ajax({
                url: this.getBaseUrl() + 'subscriptions/' + userId,
                beforeSend: this.beforeSend,
                context: this,
                type: 'GET',
                data: {
                    bearer_token: this.getToken(),
                    fields: options.fields
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete($.extend(data.Subscription, data.Payment));
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method getToken
         */
        getToken: function() {
            if (app.user.data.get('access_token')) {
                //return token for registered user if logged in
                return app.user.data.get('access_token');
            } else if (this.isGuestValid()) {
                //return token for guest user if not expired
                return this.get('guest').access_token;
            }
            return undefined;
        },
        /**
         * @method getUsers
         * @param {Array|String} userIds
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getUsers: function(userIds, options, callbackComplete, callbackError) {
            var self = this;
            var users = [];
            options = options ? option : {};
            userIds = Array.isArray(userIds) ? userIds : [userIds];
            (function next() {
                $.ajax({
                    url: self.getBaseUrl() + 'users',
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'GET',
                    data: {
                        bearer_token: self.getToken(),
                        ids: userIds.splice(0, 9).join(','),
                        fields: options.fields
                    }
                }).done(function(data) {
                    if (data.statusCode === 200) {
                        users = users.concat(data.Users);
                        if (userIds.length > 0) {
                            setTimeout(next, self.get('timeout'));
                        } else {
                            if (users.length === 1) {
                                callbackComplete(users[0]);
                            } else {
                                callbackComplete(users);
                            }
                        }
                    } else {
                        callbackError(data);
                    }
                }).fail(function(error) {
                    callbackError(error);
                });
            })();
        },
        /**
         * @method getVocabById
         * @param {Array|String} vocabIds
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getVocabById: function(vocabIds, options, callbackComplete, callbackError) {
            var self = this;
            var result = {};
            options = options ? options : {};
            vocabIds = _.uniq(Array.isArray(vocabIds) ? vocabIds : [vocabIds]);
            (function next() {
                $.ajax({
                    url: self.getBaseUrl() + 'vocabs',
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'GET',
                    data: {
                        bearer_token: self.getToken(),
                        lang: options.lang || app.user.getLanguageCode(),
                        ids: vocabIds.splice(0, 19).join('|'),
                        fields: options.fields,
                        include_strokes: options.includeStrokes,
                        include_sentences: options.includeSentences,
                        include_heisigs: options.includeHeisigs,
                        include_top_mnemonics: options.includeTopMnemonics,
                        include_decomps: options.includeDecomps
                    }
                }).done(function(data) {
                    if (data.statusCode === 200) {
                        delete data.statusCode;
                        result = app.fn.mergeObjectArrays(result, data);
                        if (vocabIds.length > 0) {
                            setTimeout(next, self.timeout);
                        } else {
                            callbackComplete(result);
                        }
                    } else {
                        callbackError(data);
                    }
                }).fail(function(error) {
                    callbackError(error);
                });
            })();
        },
        /**
         * @method getVocabByQuery
         * @param {Array|String} vocabIds
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getVocabByQuery: function(query, options, callbackComplete, callbackError) {
            options = options ? options : {};
            $.ajax({
                url: this.getBaseUrl() + 'vocabs',
                beforeSend: this.beforeSend,
                context: this,
                type: 'GET',
                data: {
                    bearer_token: this.getToken(),
                    lang: options.lang || app.user.getLanguageCode(),
                    q: query,
                    fields: options.fields,
                    include_strokes: options.includeStrokes,
                    include_sentences: options.includeSentences,
                    include_heisigs: options.includeHeisigs,
                    include_top_mnemonics: options.includeTopMnemonics,
                    include_decomps: options.includeDecomps
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method getVocabList
         * @param {String} listId
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getVocabList: function(listId, options, callbackComplete, callbackError) {
            options = options ? options : {};
            $.ajax({
                url: this.getBaseUrl() + 'vocablists/' + listId,
                beforeSend: this.beforeSend,
                context: this,
                type: 'GET',
                data: {
                    bearer_token: this.getToken(),
                    lang: options.lang || app.user.getLanguageCode(),
                    fields: options.fields,
                    sectionFields: options.sectionFields
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data.VocabList);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method getVocabListSection
         * @param {String} listId
         * @param {String} sectionId
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getVocabListSection: function(listId, sectionId, options, callbackComplete, callbackError) {
            options = options ? options : {};
            $.ajax({
                url: this.getBaseUrl() + 'vocablists/' + listId + '/sections/' + sectionId,
                beforeSend: this.beforeSend,
                context: this,
                type: 'GET',
                data: {
                    bearer_token: this.getToken(),
                    fields: options.fields
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data.VocabListSection);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method getVocabLists
         * @param {Object} [callback]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getVocabLists: function(options, callbackComplete, callbackError) {
            var self = this;
            var lists = [];
            options = options ? options : {};
            (function next(cursor) {
                $.ajax({
                    url: self.getBaseUrl() + 'vocablists',
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'GET',
                    data: {
                        bearer_token: self.getToken(),
                        lang: options.lang || app.user.getLanguageCode(),
                        cursor: cursor,
                        sort: options.sort,
                        fields: options.fields
                    }
                }).done(function(data) {
                    if (data.statusCode === 200) {
                        lists = lists.concat(data.VocabLists);
                        if (data.cursor) {
                            setTimeout(next, self.get('timeout'), data.cursor);
                        } else {
                            callbackComplete(lists);
                        }
                    } else {
                        callbackError(data);
                    }
                }).fail(function(error) {
                    callbackError(error);
                });
            })();
        },
        /**
         * @method getVocabUpdates
         * @param {String} lang
         * @param {String} offset
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        getVocabUpdates: function(offset, options, callbackComplete, callbackError) {
            var self = this;
            var updates = [];
            options = options ? options : {};
            (function next(cursor) {
                $.ajax({
                    url: self.getBaseUrl() + 'vocabupdates',
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'GET',
                    data: {
                        bearer_token: self.getToken(),
                        cursor: cursor,
                        fields: options.fields,
                        offset: offset
                    }
                }).done(function(data) {
                    if (data.statusCode === 200) {
                        updates = updates.concat(data.VocabUpdates);
                        if (data.cursor) {
                            setTimeout(next, self.get('timeout'), data.cursor);
                        } else {
                            callbackComplete(updates);
                        }
                    } else {
                        callbackError(data);
                    }
                }).fail(function(error) {
                    callbackError(error);
                });
            })();
        },
        /**
         * @method hasGuest
         * @returns {Boolean}
         */
        hasGuest: function() {
            return this.get('guest') ? true : false;
        },
        /**
         * @method isGuestValid
         */
        isGuestValid: function() {
            if (this.get('guest') && (this.get('guest').expires > moment().unix())) {
                return true;
            }
            this.set('guest', undefined, {silent: true});
            localStorage.removeItem('_guest');
            return false;
        },
        /**
         * @method postReviews
         * @param {Array} reviews
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        postReviews: function(reviews, callbackComplete, callbackError) {
            var self = this;
            var posted = [];
            (function next() {
                var batch = _.flatten(reviews.splice(0, 49));
                $.ajax({
                    url: self.getBaseUrl() + 'reviews' +
                    '?bearer_token=' + self.getToken() +
                    '&spaceItems=false',
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'POST',
                    data: JSON.stringify(batch)
                }).done(function(data) {
                    if (data.statusCode === 200) {
                        posted = posted.concat(batch);
                        if (reviews.length > 0) {
                            setTimeout(next, self.timeout);
                        } else {
                            callbackComplete(posted);
                        }
                    } else {
                        callbackError(data, posted);
                    }
                }).fail(function(error) {
                    callbackError(error, posted);
                });
            })();
        },
        /**
         * @method refreshToken
         * @param {String} token
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        refreshToken: function(token, callbackComplete, callbackError) {
            $.ajax({
                url: this.getBaseUrl() + 'oauth2/token',
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST',
                data: {
                    grant_type: 'refresh_token',
                    client_id: this.get('clientId'),
                    refresh_token: token
                }
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method requestBatch
         * @param {Array|Object} requests
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        requestBatch: function(requests, callbackComplete, callbackError) {
            $.ajax({
                url: this.getBaseUrl() + 'batch' +
                '?bearer_token=' + this.getToken(),
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST',
                data: JSON.stringify(Array.isArray(requests) ? requests : [requests])
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data.Batch);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method resetAccount
         * @param {Object} [options]
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        resetAccount: function(options, callbackComplete, callbackError) {
            options = options ? options : {};
            options.lang = options.lang ? options.lang : app.user.getLanguageCode();
            $.ajax({
                url: this.getBaseUrl() + 'reset' +
                '?lang=' + options.lang +
                '&bearer_token=' + this.getToken(),
                beforeSend: this.beforeSend,
                context: this,
                type: 'POST'
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method setGuest
         * @param {String} key
         * @param {Array|Object|String} value
         * @returns {Api}
         */
        setGuest: function(key, value) {
            this.attributes.guest[key] = value;
            this.trigger('change:guest');
            return this;
        },
        /**
         * @method updateSubscription
         * @param {Object} subscription
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        updateSubscription: function(subscription, callbackComplete, callbackError) {
            $.ajax({
                url: this.getBaseUrl() + 'subscriptions/' + app.user.id +
                '?bearer_token=' + this.getToken(),
                beforeSend: this.beforeSend,
                context: this,
                type: 'PUT',
                data: JSON.stringify(subscription)
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data.Subscription);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method updateVocabList
         * @param {Object} list
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        updateVocabList: function(list, callbackComplete, callbackError) {
            $.ajax({
                url: this.getBaseUrl()  + 'vocablists/' + list.id +
                '?bearer_token=' + this.getToken(),
                beforeSend: this.beforeSend,
                context: this,
                type: 'PUT',
                data: JSON.stringify(list)
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data.VocabList);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method updateVocabListSection
         * @param {Object} list
         * @param {Object} section
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        updateVocabListSection: function(list, section, callbackComplete, callbackError) {
            $.ajax({
                url: this.getBaseUrl()  + 'vocablists/' + list.id + '/sections/' + section.id +
                '?bearer_token=' + this.getToken(),
                beforeSend: this.beforeSend,
                context: this,
                type: 'PUT',
                data: JSON.stringify(section)
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data.VocabListSection);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method updateUser
         * @param {Object} settings
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         */
        updateUser: function(settings, callbackComplete, callbackError) {
            $.ajax({
                url: this.getBaseUrl() + 'users' +
                '?bearer_token=' + this.getToken(),
                beforeSend: this.beforeSend,
                context: this,
                type: 'PUT',
                data: JSON.stringify(settings)
            }).done(function(data) {
                if (data.statusCode === 200) {
                    callbackComplete(data.User);
                } else {
                    callbackError(data);
                }
            }).fail(function(error) {
                callbackError(error);
            });
        },
        /**
         * @method updateVocabs
         * @param {Array|Object} vocabs
         * @param {Function} callbackComplete
         * @param {Function} callbackError
         * @param {Function} callbackResult
         */
        updateVocabs: function(vocabs, callbackComplete, callbackError, callbackResult) {
            var self = this;
            var updated = [];
            vocabs = Array.isArray(vocabs) ? vocabs : [vocabs];
            vocabs = _.without(vocabs, undefined);
            (function next() {
                var vocab = vocabs.splice(0, 1)[0];
                $.ajax({
                    url: self.getBaseUrl() + 'vocabs/' + vocab.id +
                    '?bearer_token=' + self.getToken(),
                    beforeSend: self.beforeSend,
                    context: self,
                    type: 'PUT',
                    data: JSON.stringify(vocab)
                }).done(function(data) {
                    if (data.statusCode === 200) {
                        updated.push(data.Vocab.id);
                        callbackResult({
                            Items: data.Items,
                            Vocab: data.Vocab
                        });
                        if (vocabs.length > 0) {
                            setTimeout(next, self.timeout);
                        } else {
                            callbackComplete(updated);
                        }
                    } else {
                        callbackError(data, updated);
                    }
                }).fail(function(error) {
                    callbackError(error, updated);
                });
            })();
        }
    });

    return Api;
});