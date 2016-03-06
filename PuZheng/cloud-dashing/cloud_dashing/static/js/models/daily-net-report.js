define(['backbone'], function (Backbone) {
    var DailyNetReport = Backbone.Model.extend({
        defaults: {
            time: '',
            data: [], 
        }, 

        parse: function (response, options) {
            return {
                time: response.time,
                data: response.data.map(function (v) { 
                    v.latency = v.icmp;
                    return v;
                }),
            }; 
        }
    });
    return DailyNetReport;
});
