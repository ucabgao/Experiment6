/**
 * Created by Young on 14-2-13.
 */
define(['backbone'], function (Backbone) {
    var TimeSpot = Backbone.Model.extend({
        cpu: 0,
        agent:null,
        latency: 0,
        hd: 0,
        name: ""
    });
    return TimeSpot;
});
