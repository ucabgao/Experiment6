/**
 * @module Application
 */
define([
    'framework/BasePage',
    'require.text!templates/stats.html'
], function(BasePage, TemplateMobile) {
    /**
     * @class PageStats
     * @extends BasePage
     */
    var PageStats = BasePage.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.title = 'Stats';
            this.stats = app.user.stats;
            this.listenTo(app, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {PageStats}
         */
        render: function() {
            this.$el.html(this.compile(TemplateMobile));
            this.renderStats();
            this.resize();
            return this;
        },
        /**
         * @method renderStats
         * @returns {PageStats}
         */
        renderStats: function() {
            //STATS - DAY
            this.$('#stats-day .char-learned').text(this.stats.getCharLearnedTotal('rune', 'day'));
            this.$('#stats-day .word-learned').text(this.stats.getWordLearnedTotal('rune', 'day'));
            this.$('#stats-day .time-studied').text(app.fn.convertTimeToClock(this.stats.get('timeStudied').day * 1000));
            this.$('#stats-day .days-studied').text(this.stats.get('daysStudied').day);
            //STATS - WEEK
            this.$('#stats-week .char-learned').text(this.stats.getCharLearnedTotal('rune', 'week'));
            this.$('#stats-week .word-learned').text(this.stats.getWordLearnedTotal('rune', 'week'));
            this.$('#stats-week .time-studied').text(app.fn.convertTimeToClock(this.stats.get('timeStudied').week * 1000));
            this.$('#stats-week .days-studied').text(this.stats.get('daysStudied').week);
            //STATS - MONTH
            this.$('#stats-month .char-learned').text(this.stats.getCharLearnedTotal('rune', 'month'));
            this.$('#stats-month .word-learned').text(this.stats.getWordLearnedTotal('rune', 'month'));
            this.$('#stats-month .time-studied').text(app.fn.convertTimeToClock(this.stats.get('timeStudied').month * 1000));
            this.$('#stats-month .days-studied').text(this.stats.get('daysStudied').month);
            //STATS - ALL
            this.$('#stats-all .char-learned').text(this.stats.getCharLearnedTotal('rune', 'all'));
            this.$('#stats-all .word-learned').text(this.stats.getWordLearnedTotal('rune', 'all'));
            this.$('#stats-all .time-studied').text(app.fn.convertTimeToClock(this.stats.get('timeStudied').all * 1000));
            this.$('#stats-all .days-studied').text(this.stats.get('daysStudied').all);
            return this;
        },
        /**
         * @method events
         * @returns {Object}
         */
        events: _.extend({}, BasePage.prototype.events, {
            'vclick #button-sync': 'handleSyncClicked'
        }),
        /**
         * @method handleSyncClicked
         * @param {Event} event
         */
        handleSyncClicked: function(event) {
            event.preventDefault();
            app.dialogs.show().element('.message-title').text('Updating Stats');
            async.series([
                function(callback) {
                    app.user.stats.sync(function() {
                        callback();
                    }, function(error) {
                        callback(error);
                    });
                }
            ], function() {
                app.dialogs.hide();
            });
        },
        /**
         /**
         * @method resize
         * @returns {PageStats}
         */
        resize: function() {
            return this;
        }
    });

    return PageStats;
});
