define(['jquery', 'backbone', 'models/agent'], function ($, Backbone, Agent) {
    var Agents = Backbone.Collection.extend({
        model: Agent,
        url: 'http://115.28.137.212/api/cloud-list',
    });

    return new Agents();
});
