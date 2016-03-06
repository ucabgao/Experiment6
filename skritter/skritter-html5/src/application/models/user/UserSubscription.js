/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class UserSubscription
     * @extends BaseModel
     */
    var UserSubscription = BaseModel.extend({
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
         * @method cache
         */
        cache: function() {
            localStorage.setItem(this.user.id + '-subscription', JSON.stringify(this.toJSON()));
        },
        /**
         * @method getRemainingTrial
         * @returns {Boolean|Number}
         */
        getRemainingTrial: function() {
            if (this.get('expires') === false || this.isExpired() || this.get('subscribed')) {
                return false;
            }
            return moment(this.get('expires')).add(1, 'day').fromNow(true);
        },
        /**
         * @method isExpired
         * @returns {Boolean}
         */
        isExpired: function() {
            if (this.get('subscribed') || this.get('expires') === false) {
                return false;
            }
            return moment(this.get('expires')).add(1, 'day').unix() < moment().unix();
        },
        /**
         * @method isSubscribed
         * @returns {Boolean}
         */
        isSubscribed: function() {
            return this.get('expires') === false || this.get('subscribed') ? true : false;
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            var self = this;
            app.api.getSubscription(this.user.id, null, function(data) {
                self.set(data);
                callback();
            }, function(error) {
                callback(error);
            });
        },
        /**
         * @method restoreGoogle
         */
        restoreGoogle: function(callbackSuccess, callbackError) {
            var self = this;
            async.series([
                function(callback) {
                    if (plugins.billing) {
                        callback();
                    } else {
                        callback('Unable to load billing plugin.');
                    }
                },
                function(callback) {
                    plugins.billing.init(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    plugins.billing.getPurchases(function(subscription) {
                        if (subscription.length) {
                            self.set('gplay_subscription', {
                                subscription: subscription[0].productId,
                                package: subscription[0].packageName,
                                token: subscription[0].purchaseToken
                            });
                            callback();
                        } else {
                            callback('Unable to locate subscription.');
                        }
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    self.update(callback);
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackSuccess();
                }
            });
        },
        /**
         * @method subscribeGoogle
         * @param {String} sku
         * @param {Function} callbackSuccess
         * @param {Function} callbackError
         */
        subscribeGoogle: function(sku, callbackSuccess, callbackError) {
            var self = this;
            async.series([
                function(callback) {
                    if (plugins.billing) {
                        callback();
                    } else {
                        callback('Unable to load billing plugin.');
                    }
                },
                function(callback) {
                    plugins.billing.init(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                },
                function(callback) {
                    plugins.billing.subscribe(function(subscription) {
                        self.set('gplay_subscription', {
                            subscription: subscription.productId,
                            package: subscription.packageName,
                            token: subscription.purchaseToken
                        });
                        callback();
                    }, function(error) {
                        callback(error);
                    }, sku);
                },
                function(callback) {
                    self.update(callback);
                }
            ], function(error) {
                if (error) {
                    callbackError(error);
                } else {
                    callbackSuccess();
                }
            });
        },
        /**
         * @method update
         * @param {Function} callback
         */
        update: function(callback) {
            var self = this;
            app.api.updateSubscription(this.toJSON(), function(subscription) {
                self.set(subscription);
                callback();
            }, function(error) {
                callback(error.responseJSON.message);
            });
        }
    });

    return UserSubscription;
});