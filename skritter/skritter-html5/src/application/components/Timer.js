/**
 * @module Application
 */
define([
    'framework/BaseView'
], function(BaseView) {
    /**
     * @class TimerStopwatch
     */
    function Stopwatch() {
        var startAt = 0;
        var lapTime = 0;
        function now() {
            return new Date().getTime();
        }
        this.start = function() {
            startAt = startAt ? startAt : now();
        };
        this.stop = function() {
            lapTime = startAt ? lapTime + now() - startAt : lapTime;
            startAt = 0;
        };
        this.reset = function() {
            lapTime = startAt = 0;
        };
        this.time = function() {
            return lapTime + (startAt ? now() - startAt : 0);
        };
    }
    /**
     * @class Timer
     * @extends BaseView
     */
    var Timer = BaseView.extend({
        /**
         * @method initialize
         * @constructor
         */
        initialize: function() {
            this.interval = undefined;
            this.lapOffset = 0;
            this.lapStart = 0;
            this.lapTime = 0;
            this.localOffset = 0;
            this.reviewLimit = 30000;
            this.serverOffset = 0;
            this.stopwatch = new Stopwatch();
            this.thinkingLimit = 15000;
            this.thinkingTime = 0;
            this.time = 0;
            this.timeSecond = 0;
        },
        /**
         * @method render
         * @returns {Timer}
         */
        render: function() {
            this.$el.text(app.fn.convertTimeToClock(this.time));
            return this;
        },
        /**
         * @method getLapTime
         * @returns {Number}
         */
        getLapTime: function() {
            return this.lapTime + this.lapOffset;
        },
        /**
         * @method getOffset
         * @returns {number}
         */
        getOffset: function() {
            return (this.localOffset + this.serverOffset) * 1000;
        },
        /**
         * @method getReviewTime
         * @returns {Number}
         */
        getReviewTime: function() {
            var lapTime = this.getLapTime();
            return lapTime > this.reviewLimit ? this.reviewLimit / 1000 : lapTime / 1000;
        },
        /**
         * @method getThinkingTime
         * @returns {Number}
         */
        getThinkingTime: function() {
            var lapTime = this.getLapTime();
            if (this.thinkingTime) {
                return this.thinkingTime / 1000;
            }
            return lapTime > this.thinkingLimit ? this.thinkingLimit / 1000 : lapTime / 1000;
        },
        /**
         * @method isLimit
         * @return {Boolean}
         */
        isLimit: function() {
            return this.getLapTime() >= this.reviewLimit ? true : false;
        },
        /**
         * @method isRunning
         * @returns {Boolean}
         */
        isRunning: function() {
            return this.interval ? true : false;
        },
        /**
         * @method isThinking
         */
        isThinking: function() {
            return this.thinkingTime ? false : true;
        },
        /**
         * @method reset
         * @returns {Timer}
         */
        reset: function() {
            this.stopwatch.reset();
            this.lapOffset = this.lapStart = this.lapTime = 0;
            this.thinkingTime = 0;
            return this;
        },
        /**
         * @method setLapOffset
         * @param {Number} seconds
         * @returns {Timer}
         */
        setLapOffset: function(seconds) {
            this.lapOffset = seconds * 1000;
            return this;
        },
        /**
         * @method setLimits
         * @param {Number} reviewLimit
         * @param {Number} thinkingLimit
         * @return {Timer}
         */
        setLimits: function(reviewLimit, thinkingLimit) {
            this.reviewLimit = reviewLimit ? reviewLimit * 1000 : 0;
            this.thinkingLimit = thinkingLimit ? thinkingLimit * 1000 : 0;
            return this;
        },
        /**
         * @method setThinking
         * @param {Number} thinkingTime
         * @return {Timer}
         */
        setThinking: function(thinkingTime) {
            this.thinkingTime = thinkingTime ? thinkingTime * 1000 : 0;
            return this;
        },
        /**
         * @method start
         * @returns {Timer}
         */
        start: function() {
            if (!this.isRunning() && !this.isLimit()) {
                this.lapStart = new Date().getTime();
                this.stopwatch.start();
                this.interval = setInterval(_.bind(this.update, this), 100);
            }
            return this;
        },
        /**
         * @method stop
         * @returns {Timer}
         */
        stop: function() {
            if (this.isRunning()) {
                this.stopwatch.stop();
                this.interval = clearInterval(this.interval);
                this.lapOffset += this.lapTime;
                this.lapTime = 0;
            }
            return this;
        },
        /**
         * @method stopThinking
         */
        stopThinking: function() {
            this.thinkingTime = this.getLapTime();
        },
        /**
         * @method update
         */
        update: function() {
            var now = new Date().getTime();
            this.time = this.stopwatch.time() + this.getOffset();
            this.lapTime = now - this.lapStart;
            if (this.isLimit()) this.stop();
            if (this.time / 1000 >> 0 !== this.timeSecond) {
                this.timeSecond = this.time / 1000 >> 0;
                this.$el.text(app.fn.convertTimeToClock(this.time));
            }
        },
        /**
         * @method updateOffset
         * @param {Timer}
         */
        updateOffset: function() {
            this.reset();
            this.localOffset = app.user.stats.getTimerOffset();
            this.serverOffset = app.user.reviews.getTimerOffset();
            this.time = (this.localOffset + this.serverOffset) * 1000;
            return this;
        }
    });

    return Timer;
});