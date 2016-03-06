define(['backbone'], function (Backbone) {
    var DailyNetReport = Backbone.Model.extend({
        defaults: {
            time: '',
            data: [], 
        }, 
    });
    return DailyNetReport;
});
