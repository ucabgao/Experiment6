define(['jquery', 'backbone', 'models/daily-report'], function ($, Backbone, DailyReport) {

    var DailyReports = Backbone.Collection.extend({

        model: DailyReport,
        
        constructor: function (viewpoint, start, end) {
            this.viewpoint = viewpoint;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            return 'http://115.28.137.212/api/net-sum/' + this.viewpoint.id + '?at=' + this.start / 1000 + ',' + this.end / 1000;
        },

    });

    return DailyReports;
});