define(['jquery'], function () {

    function getViewpoints() {
        var deferred = $.Deferred();
        // TODO not implemented
        setTimeout(function () {
            var viewpoints = [
                {id: 1, name: "北京", location: "北京市"},
                {id: 2, name: "上海", location: "上海市"}
                ];
            var myGeo = new BMap.Geocoder();
            for (var i=0; i < viewpoints.length; ++i) {
                var viewpoint = viewpoints[i];
                (function (aViewpoint) {
                    myGeo.getPoint(aViewpoint.location, function (point) {
                        aViewpoint.point = point;
                        var pointsAllSet = viewpoints.every(function (element, 
                                index, array) {
                            return !!element.point;
                        });
                        if (pointsAllSet) {
                            deferred.resolve(viewpoints);
                        }
                    });
                })(viewpoint);
            }
        }, 100);
        
        return deferred.promise();
    }

    function getClouds() {
        var deferred = $.Deferred();
        setTimeout(function () { 
            var clouds = [
                {id: 1, name: "百度云", location: "北京市", color: "blue"},
                {id: 2, name: "阿里云", location: "杭州市", color: "green"},
            ];

            var myGeo = new BMap.Geocoder();
            for (var i=0; i < clouds.length; ++i) {
                var cloud = clouds[i];
                (function (aCloud) {
                    myGeo.getPoint(aCloud.location, function (point) {
                        aCloud.point = point;
                        var pointsAllSet = clouds.every(function (element, 
                                index, array) {
                            return !!element.point;
                        });
                        if (pointsAllSet) {
                            deferred.resolve(clouds);
                        }
                    });
                })(cloud);
            }
        }, 100);
        return deferred.promise();
    }

    function getUserLocation(viewpoints, handler) {
        // TODO not implemented
        var deferred = $.Deferred();
        var viewpoint = {id: 1, name: "北京", location: "北京市"};
        setTimeout(function () {deferred.resolve(viewpoint);}, 100);
        return deferred.promise();
    }

    function getCloudReports(viewpoint, start, end) {
        // TODO not implemented
        var deferred = $.Deferred();
        var startTime = start.getTime();
        var reports = [];
        if (end > new Date()) {
            end  = new Date().getTime();
        }
        for (var i=0; i < end - start; i += 20 * 60 * 1000) {
            var statusList = [
            {
                id: 1, 
                //latency: viewpoint.id * 20 + Math.abs(Math.floor(Math.random()*30+Math.sin(i/20+Math.random()*2)*20+Math.sin(i/10+Math.random())*10))
                latency: viewpoint.id * 20 + Math.abs(Math.floor(15+Math.sin(i/20+1)*20+Math.sin(i/10+0.5)*10))
            }, 
            {
                id: 2,
                //latency: viewpoint.id * 40 + Math.abs(Math.floor(Math.random()*30+Math.sin(i/20+Math.random()*2)*20+Math.sin(i/10+Math.random())*10))
                latency: viewpoint.id * 40 + Math.abs(Math.floor(15+Math.sin(i/20+1)*20+Math.sin(i/10+0.5)*10))
            }
            ];
            if (i % (20 * 60 * 1000 * 100) == 0) {
                statusList[(i % (20 * 60 * 1000 * 2) == 0)? 1: 0].latency = null;
            }
            reports.push({at: startTime + i, statusList: statusList});
        }

        setTimeout(function () { deferred.resolve(reports); }, 100);
        return deferred.promise();
    }

    function getDailyReport(viewpoint, start, end) {
        var deferred = $.Deferred();
        var reports = []
        start = start.getTime();
        end = end.getTime();
        var ret = [];
        for (var i=0; i < end-start; i+= 24 * 60 * 60 * 1000) {
            var data = [
            {
                id: 1,
                    latency: viewpoint.id * 20 + Math.abs(Math.floor(15+Math.sin(i/20+1)*20+Math.sin(i/10+0.5)*10))
            },
            {
                id: 2,
                latency: viewpoint.id * 40 + Math.abs(Math.floor(15+Math.sin(i/20+1)*20+Math.sin(i/10+0.5)*10))
            }
            ]
            reports.push({at: start + i, data: data});
        }
        setTimeout(function () { deferred.resolve(reports); }, 100);
        return deferred.promise();
    }

    return {
        getViewpoints: getViewpoints,
        getClouds: getClouds,
        getUserLocation: getUserLocation,
        getCloudReports: getCloudReports,
        getDailyReport: getDailyReport,
    }
});
