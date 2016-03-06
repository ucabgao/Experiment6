/**
 * Created by Young on 14-2-13.
 */
define(['jquery', 'backbone', 'models/timespot'], function ($, Backbone, TimeSpot) {
    var TimeSpots = Backbone.Collection.extend({
        model: TimeSpot
    });

    return new TimeSpots();
});
