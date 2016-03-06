define(['backbone'], function (Backbone) {
    var DailyReport = Backbone.Model.extend({
        defaults: {
            at: '',
            data: [],
        }, 
    });
    return DailyReport;
});
