/**
 * @module Application
 */
define([
    'framework/BaseModel'
], function(BaseModel) {
    /**
     * @class DataReview
     * @extends BaseModel
     */
    var DataReview = BaseModel.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.characters = [];
            this.squigs = [];
        },
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
            finished: false,
            originalItems: [],
            position: 1,
            reviews: []
        },
        /**
         * @method cache
         * @param {Function} [callback]
         */
        cache: function(callback) {
            app.storage.putItems('reviews', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method getAt
         * @param {String} [key]
         * @returns {Number|String}
         */
        getAt: function(key) {
            if (key) {
                return this.get('reviews')[this.hasContained() ? this.getPosition() : 0][key];
            }
            return this.get('reviews')[this.hasContained() ? this.getPosition() : 0];
        },
        /**
         * @method getBase
         * @returns {String}
         */
        getBase: function() {
            return this.id.split('-')[2];
        },
        /**
         * @method getBaseItem
         * @returns {DataItem}
         */
        getBaseItem: function() {
            return app.user.data.items.get(this.get('reviews')[0].itemId);
        },
        /**
         * @method getBaseReview
         * @returns {Object}
         */
        getBaseReview: function() {
            return this.get('reviews')[0];
        },
        /**
         * @method getBaseVocab
         * @returns {DataVocab}
         */
        getBaseVocab: function() {
            return this.getBaseItem().getVocab();
        },
        /**
         * @method getCharacter
         * @returns {CanvasCharacter}
         */
        getCharacter: function() {
            return this.characters[this.getPosition() - 1];
        },
        /**
         * @method getFinalScore
         * @returns {Number}
         */
        getFinalScore: function() {
            var reviews = this.get('reviews');
            var score = reviews[0].score;
            if (this.hasContained()) {
                var max = this.get('reviews').length - 1;
                var totalScore = 0;
                var totalWrong = 0;
                for (var i = 1, length = reviews.length; i < length; i++) {
                    var review = reviews[i];
                    totalScore += review.score;
                    if (review.score === 1) {
                        totalWrong++;
                    }
                }
                if (max === 2 && totalWrong === 1) {
                    score = 1;
                } else if (totalWrong > 1) {
                    score = 1;
                } else {
                    score = Math.floor(totalScore / max);
                }
            }
            return score;
        },
        /**
         * @method getItem
         * @returns {DataItem}
         */
        getItem: function() {
            return app.user.data.items.get(this.getAt('itemId'));
        },
        /**
         * @method getMaxPosition
         * @returns {Number}
         */
        getMaxPosition: function() {
            return this.hasContained() ? this.get('reviews').length - 1 : 1;
        },
        /**
         * @method getPosition
         * @returns {Number}
         */
        getPosition: function() {
            return this.hasContained() ? this.get('position') : 1;
        },
        /**
         * @method getScheduleItem
         * @returns {ScheduleItem}
         */
        getScheduleItem: function() {
            return app.user.schedule.get(this.getBaseReview().itemId);
        },
        /**
         * @method getSquig
         * @returns {createjs.Container}
         */
        getSquig: function() {
            return this.squigs[this.getPosition() - 1];
        },
        /**
         * @method getTotalReviewTime
         * @returns {Number}
         */
        getTotalReviewTime: function() {
            var reviewTime = 0;
            if (this.hasContained()) {
                for (var i = 1, length = this.get('reviews').length; i < length; i++) {
                    reviewTime += this.get('reviews')[i].reviewTime;
                }
            } else {
                reviewTime = this.get('reviews')[0].reviewTime;
            }
            return reviewTime;
        },
        /**
         * @method getTotalThinkingTime
         * @returns {Number}
         */
        getTotalThinkingTime: function() {
            var thinkingTime = 0;
            if (this.hasContained()) {
                for (var i = 1, length = this.get('reviews').length; i < length; i++) {
                    thinkingTime += this.get('reviews')[i].thinkingTime;
                }
            } else {
                thinkingTime = this.get('reviews')[0].thinkingTime;
            }
            return thinkingTime;
        },
        /**
         * @method getVocab
         * @returns {DataVocab}
         */
        getVocab: function() {
            if (this.hasContained()) {
                var vocabId = this.getBaseVocab().get('containedVocabIds')[this.getPosition() - 1];
                return app.user.data.vocabs.get(vocabId);
            }
            return this.getItem().getVocab();
        },
        /**
         * @method hasContained
         * @returns {Boolean}
         */
        hasContained: function() {
            return this.get('reviews').length > 1 ? true : false;
        },
        /**
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            return this.getPosition() === 1;
        },
        /**
         * @method isLast
         * @returns {Boolean}
         */
        isLast: function() {
            return this.getPosition() >= this.getMaxPosition();
        },
        /**
         * @method next
         * @returns {Boolean}
         */
        next: function() {
            if (this.isLast()) {
                return fale;
            }
            this.attributes.position++;
            return true;
        },
        /**
         * @method previous
         * @returns {Boolean}
         */
        previous: function() {
            if (this.isFirst()) {
                return false;
            }
            this.attributes.position--;
            return true;
        },
        /**
         * @method setAt
         * @param {Object|String} key
         * @param {Boolean|Number|String} [value]
         * @returns {Object}
         */
        setAt: function(key, value) {
            var review = this.getAt();
            if (typeof key === 'object') {
                for (var property in key) {
                    review[property] = key[property];
                }
            } else {
                review[key] = value;
            }
            return review;
        },
        /**
         * @method setBase
         * @param {Object|String} key
         * @param {Boolean|Number|String} [value]
         * @returns {Object}
         */
        setBase: function(key, value) {
            var review = this.get('reviews')[0];
            if (typeof key === 'object') {
                for (var property in key) {
                    review[property] = key[property];
                }
            } else {
                review[key] = value;
            }
            return review;
        },
        /**
         * @method setSquig
         * @param {createjs.Container} squig
         * @returns {DataReview}
         */
        setSquig: function(squig) {
            this.squigs[this.getPosition() - 1] = squig;
            return this;
        },
        /**
         * @method save
         * @param {Function} callback
         */
        save: function(callback) {
            var self = this;
            var configs = app.user.data.srsconfigs.getConfigs(this.get('part'));
            var originalItems = _.cloneDeep(this.get('originalItems'));
            for (var i = 0, length = this.get('reviews').length; i < length; i++) {
                //load required resources for updating
                var review = this.get('reviews')[i];
                var item = _.find(originalItems, {id: review.itemId});
                //update values for base review
                if (this.get('reviews').length > 1 && i === 0) {
                    review.reviewTime = this.getTotalReviewTime();
                    review.score = this.getFinalScore();
                    review.thinkingTime = this.getTotalThinkingTime();
                }
                //update review based on item and score
                $.extend(review, {
                    actualInterval: item.last ? review.submitTime - item.last : undefined,
                    currentInterval: item.interval,
                    newInterval: app.fn.calculateInterval(item, review.score, configs),
                    previousInterval: item.previousInterval,
                    previousSuccess: item.previousSuccess
                });
                //update local item based on review
                $.extend(item, {
                    changed: review.submitTime,
                    last: review.submitTime,
                    interval: review.newInterval,
                    next: review.submitTime + review.newInterval,
                    previousInterval: review.currentInterval,
                    previousSuccess: review.score > 1 ? true : false,
                    reviews: item.reviews + 1,
                    successes: review.score > 1 ? item.successes + 1 : item.successes,
                    timeStudied: item.timeStudied + review.reviewTime
                });
            }
            async.each(app.user.data.items.add(originalItems, {merge: true}), function(item, callback) {
                //skip caching items without specified id
                if (item.id) {
                    item.cache(callback);
                } else {
                    callback();
                }
            }, function(error) {
                if (error) {
                    console.error('REVIEW:', 'Unable to save review.');
                } else {
                    app.user.reviews.add(self, {merge: true});
                    self.cache(callback);
                }
            });
        },
        /**
         * @method uncache
         * @param {Function} callback
         */
        uncache: function(callback) {
            app.storage.removeItems('reviews', this.id, function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    });

    return DataReview;
});
