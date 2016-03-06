/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class UserStats
     * @extends BaseModel
     */
    var UserStats = BaseModel.extend({
        /**
         * @method initialize
         * @param {User} user
         * @constructor
         */
        initialize: function(attributes, options) {
            this.user = options.user;
            this.on('change', this.cache);
        },
        /**
         * @property
         * @type Object
         */
        defaults: {
            char: {},
            daysStudied: {},
            timeStudied: {},
            word: {}
        },
        /**
         * @method cache
         */
        cache: function() {
            localStorage.setItem(this.user.id + '-stats', JSON.stringify(this.toJSON()));
        },
        /**
         * @method getCharLearnedTotal
         * @param {String} part
         * @param {String} step
         */
        getCharLearnedTotal: function(part, step) {
            return this.get('char')[part].learned[step];
        },
        /**
         * @method getTime
         * @returns {Number}
         */
        getTime: function() {
            var timeStudied = this.get('timeStudied') ? Math.floor(this.get('timeStudied').day) : 0;
            return timeStudied + this.user.reviews.getTimerOffset();
        },
        /**
         * @method getTimerOffset
         * @returns {Number}
         */
        getTimerOffset: function() {
            return this.get('timeStudied').day ? this.get('timeStudied').day : 0;
        },
        /**
         * @method getWordLearnedTotal
         * @param {String} part
         * @param {String} step
         */
        getWordLearnedTotal: function(part, step) {
            return this.get('word')[part].learned[step];
        },
        /**
         * @method sync
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        sync: function(callbackSuccess, callbackError) {
            var self = this;
            async.waterfall([
                function(callback) {
                    app.api.getDate(function(data) {
                        callback(null, data);
                    }, function(error) {
                        callback(error);
                    });
                },
                function(date, callback) {
                    app.api.getStats({
                        lang: app.user.getLanguageCode(),
                        start: date.today
                    }, function(data) {
                        self.set(data[0]);
                        callback();
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
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            });
        }
    });

    return UserStats;
});