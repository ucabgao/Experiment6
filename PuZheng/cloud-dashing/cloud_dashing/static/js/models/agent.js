define(['backbone'], function (Backbone) {
    var Agent = Backbone.Model.extend({
        defaults: {
            name: '',
            provider: '',
            location: '',
            color: '',
            crash_in_week: 0,
            latency_in_week: [],
            crash_in_month: 0,
            latency_in_month: [],
            official_site: '',
            selected: true,
        }, 
    });
    return Agent;
});
