define(['jquery', 'backbone', 'models/report'], function ($, Backbone, Report) {

    var Reports = Backbone.Collection.extend({

        model: Report,

        constructor: function (viewpoint, start, end) {
            this.viewpoint = viewpoint;
            this.start = start;
            this.end = end;
            Backbone.Collection.apply(this, arguments);
        },

        url: function () {
            return 'http://115.28.137.212/api/basic/' + this.viewpoint.id + '?at=' + this.start / 1000 + ',' + this.end / 1000;
        },
        parse: function (resp, options) {
            var result = [];
            _.each(resp, function (val) {
                if (!(_.isEmpty(val.data))) {
                    result.push(val);
                }
            });
            return result;
        }
    });

    return Reports;
});
