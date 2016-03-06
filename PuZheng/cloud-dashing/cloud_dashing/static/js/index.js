(function () {
    function getMode() {
        return $(".mode-btn").text() == '日'? 'day': 'week';
    }

    var MS_A_DAY = 24 * 60 * 60 * 1000 - 1;
    var MS_A_WEEK = 7 * (MS_A_DAY + 1) - 1;
    require([
                'jquery',
                'functions',
                //'viewpointSwitcher',
                //'cloudMarker',
                //'timeline',
                //'toastr',
                'moment',
                'utils',
                //'dailyAvgLatencyBar',
                'baiduMap',
            ],
            function($, functions, /*vps, cm, tl, toastr, */ moment, utils, /*dalb,*/ BMap) {
                //toastr.options = {
                    //"positionClass": "toast-bottom-full-width",
                    //"timeOut": "1000",
                //}
                function initMap() {
                    var chinaGeoCenter = new BMap.Point(103.336594, 35.849248);
                    var map = new BMap.Map("map");
                    map.centerAndZoom(chinaGeoCenter, 5); 
                    var  mapStyle ={ 
                        features: ["water", "land"]
                    };
                    map.setMapStyle(mapStyle);
                    map.addControl(new BMap.NavigationControl());
                    return map;
                }

                var today = new Date();
                var globals = {
                    map: initMap(),
                    viewpointSwitcher: null,
                    mode: 'week',
                    timeline: null,
                    selectedDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                };

                //$('.mode-btn').click(function () {
                    //var start = null;
                    //var end = null;
                    //if (getMode() === 'day') {
                        //$(this).text('周');
                        //start = utils.getMonday(globals.timeline.getCurrentDate());
                        //end = new Date(start.getTime() + MS_A_WEEK);
                    //} else {
                        //$(this).text('日');
                        //start = globals.timeline.getCurrentDate();
                        //start = new Date(start.getFullYear(), start.getMonth(), 
                            //start.getDate());
                        //end = new Date(start.getTime() + MS_A_DAY);
                    //}
                    //globals.timeline = displayTimeLine(globals.clouds, 
                        //globals.viewpointSwitcher.getCurrentViewpoint(), 
                        //start, end, 
                        //globals.timeline.getCurrentDate());
                    //$('span.selectedDate').text(moment(start).format('YYYY-MM-DD')).toggle();
                //});

                //function displayTimeLine(clouds, viewpoint, start, end,
                    //initDate) {
                    //var cloudsMap = {};
                    //for (var i=0; i < clouds.length; ++i) {
                        //var cloud = clouds[i];
                        //cloudsMap[cloud.id] = cloud;
                    //}
                    //var timeline = new tl.TimeLine($('#timeline'), 
                        //viewpoint, start, end, initDate, clouds, function (report1, report2, pos, timeline) {
                            //if (report1) {
                                //for (var i=0; i < report1.statusList.length; ++i) {
                                    //var cloudStatus = report1.statusList[i];
                                    //var y1 = cloudStatus.latency;
                                    //var y2 = report2.statusList[i].latency;
                                    //var x1 = report1.at;
                                    //var x2 = report2.at;
                                    //var latency = null;
                                    //if (y1 && y2) {
                                        //if (x1 === x2) {
                                            //latency = Math.floor(y1);
                                        //} else {
                                            //latency = Math.floor(y1 + (y2 - y1) * (pos.x - x1) / (x2 - x1))
                                        //}
                                    //} 
                                    //var cloud = cloudsMap[cloudStatus.id];
                                    //if (timeline.isCloudSelected(cloud)) {
                                        //cloud.marker.update(latency);
                                        //cloud.marker.show();
                                    //} else {
                                        //cloud.marker.hide();
                                    //}
                                //}
                            //} else {
                                //for (var cloudId in cloudsMap) {
                                    //var cloud = cloudsMap[cloudId];
                                    //if (timeline.isCloudSelected(cloud)) {
                                        //cloud.marker.update(-1);
                                    //} else {
                                        //cloud.marker.hide();
                                    //}
                                //}
                            //}
                        //});
                    //timeline.init();
                    //return timeline;
                //}

                //$('span.selectedDate').text(moment().format('YYYY-MM-DD'));
                //$.when(functions.getViewpoints(), functions.getClouds()).then(function (viewpoints, clouds) {
                    //globals.clouds = clouds;
                    //for (var i=0; i < clouds.length; ++i) {
                        //clouds[i].selected = true;
                    //}
                    //var start = new Date();
                    //start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    //var end = new Date(start.getTime() + MS_A_DAY);

                    //globals.viewpointSwitcher = new vps.ViewpointSwitcher(viewpoints,
                        //function (oldViewpoint, newViewpoint, viewpointSwitcher) {
                            //globals.timeline = displayTimeLine(clouds, 
                                //newViewpoint, start, end, new Date());
                        //});
                    //globals.map.addControl(globals.viewpointSwitcher);
                    //for (var i=0; i < clouds.length; ++i) {
                        //var cloud = clouds[i];
                        //cloud.marker = new cm.CloudMarker(cloud.id, cloud.point);
                        //globals.map.addOverlay(cloud.marker);
                    //}
                    //$('.play-btn').click(function () {
                        //$(this).find('i').toggleClass('fa-play fa-pause');
                        //globals.timeline.playPause();
                    //});
                    //$('.backward-btn').click(function () {
                        //var start = null;
                        //var end = null;
                        //if (getMode() == 'day') {
                            //start = new Date(globals.timeline.getCurrentDate().getTime() - MS_A_DAY);
                            //start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                            //end = new Date(start.getTime() + MS_A_DAY);
                            //$('span.selectedDate').text(moment(start).format('YYYY-MM-DD'));
                        //} else {
                            //start = new Date(utils.getMonday(globals.timeline.getCurrentDate()).getTime() - MS_A_WEEK);
                            //end = new Date(start.getTime() + MS_A_WEEK);
                        //}
                        //globals.timeline.pause();
                        //$('.play-btn i').removeClass('fa-pause').addClass('fa-play');
                        //globals.timeline = displayTimeLine(clouds, 
                            //globals.viewpointSwitcher.getCurrentViewpoint(), 
                            //start, end, end);
                    //});
                    //$('.forward-btn').click(function () {
                        //var start = null;
                        //var end = null;
                        //if (getMode() == 'day') {
                            //var today = new Date();
                            //today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            //if (globals.timeline.getCurrentDate() >= today) {
                                //toastr.warning('已经是今天了!'); 
                                //return;
                            //}
                            //start = new Date(globals.timeline.getCurrentDate().getTime() + MS_A_DAY);
                            //start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                            //end = new Date(start.getTime() + MS_A_DAY);
                            //$('span.selectedDate').text(moment(start).format('YYYY-MM-DD'));
                        //} else {
                            //if (globals.timeline.getCurrentDate() >= utils.getMonday(new Date())) {
                                //toastr.warning('已经是最后一周了!'); 
                                //return;
                            //}
                            //start = new Date(utils.getMonday(globals.timeline.getCurrentDate().getTime()).getTime() + MS_A_WEEK);
                            //end = new Date(start.getTime() + MS_A_WEEK);

                        //}
                        //globals.timeline.pause();
                        //$('.play-btn i').removeClass('fa-pause').addClass('fa-play');
                        //globals.timeline = displayTimeLine(clouds, 
                            //globals.viewpointSwitcher.getCurrentViewpoint(), 
                            //start, end, end);
                    //});
                    //for (var i=0; i < viewpoints.length; ++i) {
                        //var viewpoint = viewpoints[i];
                        //new dalb.DailyAvgLatencyBar(viewpoint, clouds).init($('<div class="daily-avg-latency-bar"></div>').appendTo($('#daily-avg-latency')));
                    //}
                //}).then(function (viewpoints, clouds) {
                    //return functions.getUserLocation();
                //}).done(function (currentViewpoint, viewpoints, clouds) {
                    //globals.viewpointSwitcher.setViewpoint(currentViewpoint);
                //});
            });
})();
