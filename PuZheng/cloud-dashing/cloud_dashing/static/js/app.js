define(['views/app-view', 'router/app-router'], function (AppView, AppRouter, common) {
    var router = new AppRouter();
    var appView = new AppView(router);
    Backbone.history.start();
});
