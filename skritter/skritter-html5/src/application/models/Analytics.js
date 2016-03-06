/**
 * @module Application
 */
define(['framework/BaseModel'], function(BaseModel) {
    /**
     * @class Analytics
     * @extends {BaseModel}
     */
    var Analytics = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options ? options : {};
            this.enabled = false;
        },
        /**
         * @method setUserId
         * @param {String} userId
         * @@param {Function} callback
         */
        setUserId: function(userId, callback) {
            if (this.enabled && plugins.analytics.setUserId === 'function') {
                plugins.analytics.setUserId(userId, function() {
                    callback();
                }, function() {
                    callback();
                });
            } else {
                callback();
            }
        },
        /**
         * @method startTrackerWithId
         * @param {String} trackingId
         * @param {Function} callback
         */
        startTrackerWithId: function(trackingId, callback) {
            var self = this;
            if (app.isNative() && plugins.analytics) {
                plugins.analytics.startTrackerWithId(trackingId, function() {
                    self.enabled = true;
                    callback();
                }, function() {
                    self.enabled = false;
                    callback();
                });
            } else {
                callback();
            }
        },
        /**
         * @method trackEvent
         * @param {String} category
         * @param {String} action
         * @param {String} [label]
         * @param {Number} [value]
         *
         */
        trackEvent: function(category, action, label, value) {
            if (this.enabled) {
                plugins.analytics.trackEvent(category, action, label, value);
            }
        },
        /**
         * @method trackUserEvent
         * @param {String} action
         * @param {Number} [value]
         *
         */
        trackUserEvent: function(action, value) {
            if (this.enabled) {
                plugins.analytics.trackEvent('User', action, app.user.settings.get('name'), value);
            }
        },
        /**
         * @method trackView
         * @param {String} title
         */
        trackView: function(title) {
            if (this.enabled) {
                plugins.analytics.trackView(title);
            }
        }
    });

    return Analytics;
});
