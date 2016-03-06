define(['backbone'], function (Backbone) {
    var Report = Backbone.Model.extend({
        defaults: {
            at: '',
            data: [],
        }, 
    });
    return Report;
});
