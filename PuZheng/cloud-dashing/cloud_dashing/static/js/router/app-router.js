/**
 * Created by Young on 14-2-13.
 */
define(["backbone", "jquery", 'common'], function(Backbone, $, common){
    var AppRouter = Backbone.Router.extend({
        routes: {
            "*filter": 'filter',
        },
        //filter: function (param) {
            //common.appView.route(param);
        //},
        //routes: {
            //"": "renderMap",
            //"map": "renderMap",
            //"table": "renderTable",
            //"stat": "renderStat", 
        //},
        //renderMap: function () {
            //$('.map').show();
            //$('.table').hide();
            //$('.stat').hide();
            //$(".map-li").addClass("active");
            //$(".table-li").removeClass("active");
            //$(".stat-li").removeClass('active');
            //$('.timeline').show();
        //},
        //renderTable: function () {
            //$('.map').hide();
            //$('.table').show();
            //$('.stat').hide();
            //$(".map-li").removeClass("active");
            //$(".table-li").addClass("active");
            //$(".stat-li").removeClass('active');
            //$('.timeline').show();
        //},
        //renderStat: function () {
            //$('.map').hide();
            //$('.table').hide();
            //$('.stat').show();
            //$(".map-li").removeClass("active");
            //$(".table-li").removeClass("active");
            //$(".stat-li").addClass('active');
            //$('.timeline').hide();
        //}
    });
    return AppRouter;
})
