/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/user/ScheduleItem'
], function(BaseCollection, ScheduleItem) {
    /**
     * @class ScheduleItems
     * @extend BaseCollection
     */
    var ScheduleItems = BaseCollection.extend({
        /**
         * @method initialize
         * @param {Array} models
         * @param {Object} options
         * @constructor
         */
        initialize: function(models, options) {
            options = options ? options : {};
            this.user = options.user;
            this.filtered = [];
            this.recent = [];
        },
        /**
         * @property model
         * @type ScheduleItem
         */
        model: ScheduleItem,
        /**
         * @method addRecent
         * @param {String} base
         * @returns {Array}
         */
        addRecent: function(base) {
            if (this.recent.indexOf(base) === -1) {
                this.recent.unshift(base);
                if (this.recent.length > 2) {
                    this.recent.pop();
                }
            }
            return this.recent;
        },
        /**
         * @method banItems
         * @param {String} vocabId
         * @returns {Array}
         */
        banItems: function(vocabId) {
            var items = this.getByBase(vocabId);
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                item.set('vocabIds', []);
            }
            this.updateFilter();
            return items;
        },
        /**
         * @method getByBase
         * @param {String} vocabId
         * @returns {Array}
         */
        getByBase: function(vocabId) {
            var base = '-' + vocabId.split('-')[1] + '-';
            return this.filter(function(item) {
                return item.id.indexOf(base) > -1;
            });
        },
        /**
         * @method getDue
         * @returns {Array}
         */
        getDue: function() {
            var now = moment().unix();
            return this.filtered.filter(function(item) {
                return item.attributes.next < now;
            });
        },
        /**
         * @method getDueCount
         * @returns {Number}
         */
        getDueCount: function() {
            return this.getDue().length;
        },
        /**
         * @method getNew
         * @returns {Array}
         */
        getNew: function() {
            return this.filtered.filter(function(item) {
                return item.isNew();
            });
        },
        /**
         * @method getNext
         * @returns {DataItem}
         */
        getNext: function() {
            var items = this.sortFilter();
            for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                if (!item.attributes.vocabIds.length) {
                    continue;
                }
                if (this.recent.indexOf(item.getBase()) !== -1) {
                    continue;
                }
                return item;
            }
            return items[0];
        },
        /**
         * @method getRecentCount
         */
        getRecentCount: function() {
            var offset = moment().tz(this.user.settings.get('timezone')).startOf('day').unix();
            var recentItems = this.filtered.filter(function(item) {
                return item.attributes.created > offset;
            });
            var recentIds = recentItems.map(function(item) {
                return item.id.split('-')[2];
            });
            return _.uniq(recentIds).length;
        },
        /**
         * @method insert
         * @param {Array|Object} items
         * @param {Object} [options]
         */
        insert: function(items, options) {
            items = Array.isArray(items) ? items : [items];
            options = options ? options : {};
            options.merge = options.merge === undefined ? true : options.merge;
            options.silent = options.silent === undefined ? false : options.silent;
            options.sort = options.sort === undefined ? true : options.sort;
            var scheduleItems = [];
            for (var i = 0, length = items.length; i < length; i++) {
                scheduleItems.push(items[i]);
            }
            console.log('UPDATING SCHEDULE:', scheduleItems);
            return this.add(scheduleItems, options);
        },
        /**
         * @method isFiltered
         * @returns {Boolean}
         */
        isFiltered: function() {
            return this.filtered.length < this.length;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getSchedule(function(data) {
                self.reset();
                self.lazyAdd(data, callback, {silent: true});
            });
        },
        /**
         * @method logSchedule
         * @param {Number} [limit]
         */
        logSchedule: function(limit) {
            limit = limit || 10;
            var now = moment().unix();
            var items = this.sortFilter();
            for (var i = 0, length = limit || items.length; i < length; i++) {
                var item = items[i];
                if (item) {
                    console.log(item.id, item.getReadiness(now));
                } else {
                    break;
                }
            }
        },
        /**
         * @method sortFilter
         * @returns {Array}
         */
        sortFilter: function() {
            var now = moment().unix();
            this.filtered = _.sortBy(this.filtered, function(item) {
                return -item.getReadiness(now);
            });
            this.trigger('sort', this);
            return this.filtered;
        },
        /**
         * @method updateFilter
         * @returns {ScheduleItems}
         */
        updateFilter: function() {
            var activeLists = this.user.settings.getActiveLists();
            var activeParts = this.user.settings.getActiveParts();
            var activeStyles = this.user.settings.getActiveStyles();
            var languageCode = this.user.getLanguageCode();
            this.filtered = this.filter(function(item) {
                //filter out items that contain no vocab ids
                if (!item.attributes.vocabIds.length) {
                    return false;
                }
                //filter out items not matching an active part
                if (activeParts.indexOf(item.attributes.part) === -1) {
                    return false;
                }
                //filter out items not contained in an active list
                if (activeLists) {
                    for (var i = 0, length = activeLists.length; i < length; i++) {
                        if (item.attributes.vocabListIds.indexOf(activeLists[i]) !== -1) {
                            return true;
                        }
                    }
                    return false;
                }
                //chinese specific filters
                if (languageCode === 'zh') {
                    //filter out items not matching an active style
                    if (activeStyles.indexOf(item.attributes.style) === -1) {
                        return false;
                    }
                }
                //japanese specific filters
                if (languageCode === 'ja') {
                    //filter out kana only vocabs when setting not enabled
                    if (!app.user.settings.get('studyKana') && app.fn.isKana(item.id.split('-')[2])) {
                        return false;
                    }
                }
                return true;
            });
            this.trigger('sort', this);
            return this;
        }
    });

    return ScheduleItems;
});