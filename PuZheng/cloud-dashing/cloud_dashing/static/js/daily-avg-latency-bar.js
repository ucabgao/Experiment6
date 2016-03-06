define(['functions', 'utils', 'jquery', 'jquery.plot'], 
        function (functions, utils, $) {
            function DailyAvgLatencyBar(viewpoint, clouds) {
                this._viewpoint = viewpoint;
                this._cloudsMap = {};
                for (var i=0; i < clouds.length; ++i) {
                    var cloud = clouds[i];
                    this._cloudsMap[cloud.id] = cloud;
                }
            }

            DailyAvgLatencyBar.prototype.init = function (container) {
                this._container = container;
                this._start = utils.getMonday(new Date());
                this._end = new Date(this._start.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
                this._options = {
                    series: {
                        stack: true,
                        bars: {
                            show: true,
                            barWidth: 24*60*60*1000, 
                        },
                    },
                    xaxis: {
                        mode: 'time',
                        min: this._start.getTime(),
                        max: this._end.getTime(),
                    },
                    grid: {
                        borderWidth: {
                            top: 0,
                            right: 0,
                            bottom: 1,
                            left: 1
                        },
                    }
                };
                var that = this;
                functions.getDailyReport(this._viewpoint, this._start, this._end).then(function (reports) {
                    var seriesMap = {};
                    for (var i=0; i < reports.length; ++i) {
                        var report = reports[i];
                        for (var j=0; j < report.data.length; ++j) {
                            var d = report.data[j];
                            if (!(d.id in seriesMap)) {
                                seriesMap[d.id] = [];
                            }
                            seriesMap[d.id].push([report.at, d.latency]);
                        }
                    }

                    var data = [];
                    for (var id in seriesMap) {
                        var series = seriesMap[id];
                        data.push({
                            //label: that._cloudsMap[id].name,
                            label: ['北京', '上海', '广州'][id],
                            data: seriesMap[id]
                        });
                    }
                    this._plot = $.plot(that._container, data, that._options); 
                });
            }

            return {
                DailyAvgLatencyBar: DailyAvgLatencyBar
            }
        });
