define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class IndexedDBAdapter
     * @extends BaseModel
     */
    var IndexedDBAdapter = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {},
        /**
         * @property defaults
         * @type Object
         */
        defaults: {
            database: undefined,
            databaseName: undefined,
            databaseVersion: 1
        },
        /**
         * @method clear
         * @param {Array|String} tables
         * @param {Function} callback
         */
        clear: function(tables, callback) {
            if (tables) {
                var transaction = this.get('database').transaction(tables, 'readwrite');
                tables = Array.isArray(tables) ? tables : [tables];
                transaction.oncomplete = function() {
                    callback();
                };
                transaction.onerror = function(error) {
                    callback(error);
                };
                for (var i = 0, length = tables.length; i < length; i++) {
                    transaction.objectStore(tables[i]).clear();
                }
            } else {
                callback();
            }
        },
        /**
         * @method clearAll
         * @param {Function} callback
         */
        clearAll: function(callback) {
            var tables = [];
            for (var i = 0, length = this.get('database').objectStoreNames.length; i < length; i++) {
                tables.push(this.get('database').objectStoreNames[i]);
            }
            this.clear(tables, callback);
        },
        /**
         * @method destroy
         * @param {Function} callback
         */
        destroy: function(callback) {
            var self = this;
            if (this.isLoaded()) {
                this.get('database').close();
                var request = indexedDB.deleteDatabase(this.get('databaseName'));
                request.onsuccess = function() {
                    indexedDB.deleteDatabase(self.get('databaseName'));
                    self.set({database: undefined, databaseName: undefined});
                    setTimeout(callback, 0);
                };
                request.onerror = function(error) {
                    callback(error);
                };
            } else {
                callback();
            }
        },
        /**
         * @method getAll
         * @param {String} table
         * @param {Function} callback
         */
        getAll: function(table, callback) {
            var data = [];
            if (table) {
                var transaction = this.get('database').transaction(table, 'readonly');
                transaction.oncomplete = function () {
                    callback(data);
                };
                transaction.onerror = function (error) {
                    callback(error);
                };
                transaction.objectStore(table).openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        data.push(cursor.value);
                        cursor.continue();
                    }
                };
            } else {
                callback(data);
            }
        },
        /**
         * @method getBanned
         * @param {Function} callback
         */
        getBanned: function(callback) {
            var self = this;
            var data = [];
            var transaction = self.get('database').transaction('vocabs', 'readonly');
            transaction.oncomplete = function() {
                callback(data);
            };
            transaction.onerror = function(error) {
                callback(error);
            };
            transaction.objectStore('vocabs').openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.bannedParts.length) {
                        data.push(cursor.value);
                    }
                    cursor.continue();
                }
            };
        },
        /**
         * @method getCount
         * @param {String} table
         * @param {Function} callback
         */
        getCount: function(table, callback) {
            var count = 0;
            if (table) {
                var transaction = this.get('database').transaction(table, 'readonly');
                transaction.oncomplete = function () {
                    callback(count);
                };
                transaction.onerror = function (error) {
                    callback(error);
                };
                transaction.objectStore(table).count().onsuccess = function(event) {
                    count = event.target.result;
                };
            } else {
                callback(count);
            }
        },
        /**
         * @method getItem
         * @param {String} table
         * @param {Array|String} ids
         * @param {Function} callback
         */
        getItems: function(table, ids, callback) {
            var items = [];
            if (table && ids) {
                ids = Array.isArray(ids) ? ids : [ids];
                var transaction = this.get('database').transaction(table, 'readonly');
                var objectStore = transaction.objectStore(table);
                var push = function(event) {
                    if (event.target.result) {
                        items.push(event.target.result);
                    }
                };
                transaction.oncomplete = function() {
                    callback(items);
                };
                transaction.onerror = function(event) {
                    console.error(event);
                };
                for (var i = 0, length = ids.length; i < length; i++) {
                    var request = objectStore.get(ids[i]);
                    request.onsuccess = push;
                }
            } else {
                callback(items);
            }
        },
        /**
         * @method getSchedule
         * @param {Function} callback
         */
        getSchedule: function(callback) {
            var self = this;
            var data = [];
            var transaction = self.get('database').transaction('items', 'readonly');
            transaction.oncomplete = function() {
                callback(data);
            };
            transaction.onerror = function(error) {
                callback(error);
            };
            transaction.objectStore('items').openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.vocabIds.length) {
                        data.push(cursor.value);
                    }
                    cursor.continue();
                }
            };
        },
        /**
         * @method getStarred
         * @param {Function} callback
         */
        getStarred: function(callback) {
            var self = this;
            var data = [];
            var transaction = self.get('database').transaction('vocabs', 'readonly');
            transaction.oncomplete = function() {
                callback(data);
            };
            transaction.onerror = function(error) {
                callback(error);
            };
            transaction.objectStore('vocabs').openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.starred) {
                        data.push(cursor.value);
                    }
                    cursor.continue();
                }
            };
        },
        /**
         * @method getVocabIdByBase
         * @param {Array|String} bases
         * @param {Function} callback
         */
        getVocabIdByBase: function(bases, callback) {
            var self = this;
            var data = [];
            var transaction = self.get('database').transaction('vocabs', 'readonly');
            bases = Array.isArray(bases) ? bases : [bases];
            bases = bases.map(function(base) {
                return '-' + base + '-';
            });
            transaction.oncomplete = function() {
                callback(data);
            };
            transaction.onerror = function(error) {
                callback(error);
            };
            transaction.objectStore('vocabs').openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    var base = '-' + cursor.value.id.split('-')[1] + '-';
                    if (bases.indexOf(base) > -1) {
                        data.push(cursor.value.id);
                    }
                    cursor.continue();
                }
            };
        },
        /**
         * @method isLoaded
         * @returns {Boolean}
         */
        isLoaded: function() {
            return this.get('database') ? true : false;
        },
        /**
         * @method open
         * @param {String} databaseName
         * @param {Function} callback
         */
        open: function(databaseName, callback) {
            var self = this;
            var request = indexedDB.open(databaseName, this.get('databaseVersion'));
            request.onsuccess = function(event) {
                if (event.target.result.objectStoreNames.length > 0) {
                    self.set('database', event.target.result);
                    self.set('databaseName', databaseName);
                    callback();
                } else {
                    indexedDB.deleteDatabase(databaseName);
                    app.reload();
                }
            };
            request.onerror = function(error) {
                callback(error);
            };
            request.onupgradeneeded = function(event) {
                var database = event.target.result;
                database.createObjectStore('decomps', {keyPath: 'writing'});
                database.createObjectStore('items', {keyPath: 'id'});
                database.createObjectStore('reviews', {keyPath: 'id'});
                database.createObjectStore('sentences', {keyPath: 'id'});
                database.createObjectStore('srsconfigs', {keyPath: 'part'});
                database.createObjectStore('strokes', {keyPath: 'rune'});
                database.createObjectStore('vocablists', {keyPath: 'id'});
                database.createObjectStore('vocabs', {keyPath: 'id'});
            };
        },
        /**
         * @method putItems
         * @param {String} table
         * @param {Array|Object} items
         * @param {Function} callback
         */
        putItems: function(table, items, callback) {
            if (table && items) {
                var transaction = this.get('database').transaction(table, 'readwrite');
                var objectStore = transaction.objectStore(table);
                items = Array.isArray(items) ? items : [items];
                transaction.oncomplete = function () {
                    callback();
                };
                transaction.onerror = function (error) {
                    callback(error);
                };
                for (var i = 0, length = items.length; i < length; i++) {
                    objectStore.put(items[i]);
                }
            } else {
                callback();
            }
        },
        /**
         * @method removeItems
         * @param {String} table
         * @param {Array|String} ids
         * @param {Function} callback
         */
        removeItems: function(table, ids, callback) {
            if (table && ids) {
                ids = Array.isArray(ids) ? ids : [ids];
                var transaction = this.get('database').transaction(table, 'readwrite');
                var objectStore = transaction.objectStore(table);
                transaction.oncomplete = function() {
                    callback();
                };
                transaction.onerror = function(error) {
                    callback(error);
                };
                for (var i = 0, length = ids.length; i < length; i++) {
                    objectStore.delete(ids[i]);
                }
            } else {
                callback();
            }
        }
    });

    return IndexedDBAdapter;
});