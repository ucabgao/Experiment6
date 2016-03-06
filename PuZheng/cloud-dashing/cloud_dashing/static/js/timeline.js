define([
        'functions', 'jquery', 'utils', 'jquery.plot', 'jquery.plot.crosshair', 
        'jquery.plot.time'], function (functions, $, utils) {
    function TimeLine(container, viewpoint, start, end, initDate, clouds, onDateSelected) {
        this._container = container;
        this._viewpoint = viewpoint;
        this._cloudsMap = {};
        this._updating = false;
        for (var i=0; i < clouds.length; ++i) {
            var cloud = clouds[i];
            this._cloudsMap[cloud.id] = cloud;
        }
        this._start = start;
        this._end = end;
        this._initDate = initDate;
        this._currentTimeTag = $('<span id="currentTime"></span>').insertBefore(this._container).hide();
        this._onDateSelected = onDateSelected;
        var that = this;
        this._container.on("mouseout", 
                function onMouseOut(e) {
                    that._currentTimeTag.hide();
                    that._updateLegends(that._markedPosition)
                });
        this._container.on("plothover",  function (event, pos, item) {
            if (!that._updating) {
                setTimeout(function () {that._updateTime(pos)}, 50);
                that._updating = true;
            }
        });
        this._container.on('plotclick', function (event, pos, item){
            that.setMarkedPosition(pos);
        });
        this._playing = false;
        var that = this;
        this._options = {
            xaxis: {
                mode: 'time',
                min: this._start.getTime(),
                max: this._end.getTime(),
            },
            crosshair: {
                mode: "x",
                color: "gray",
                lineWidth: 1
            },
            grid: {
                clickable: true,
                hoverable: true,
                autoHighlight: false,
                borderWidth: {
                    top: 0,
                    right: 0,
                    bottom: 1,
                    left: 1
                },
                markings: function (axes) {
                    ret = [];
                    for (var i=0; i < that._reports.length; ++i) {
                        var report = that._reports[i];
                        for (var j=0; j < report.statusList.length; ++j) {
                            var status_ = report.statusList[j];
                            var cloud = that._cloudsMap[status_.id];
                            if (cloud.selected && status_.latency == null) {
                                var from = null;
                                if (i == 0) {
                                    from = report.at;
                                } else {
                                    from = that._reports[i-1].at;
                                }
                                
                                var to = null;
                                if (i + 1 < that._reports.length) {
                                    to = that._reports[i+1].at;
                                } else {
                                    to = new Date().getTime();
                                }
                                ret.push({
                                    yaxis: {
                                        from: 100000,
                                        to: 0,
                                    },
                                    xaxis: {
                                        from: from,
                                        to: to,
                                    },
                                    color: cloud.color,
                                });
                            }
                        }
                    }
                    ret.push({
                        yaxis: {
                            from: 1000000,
                            to: 0
                        },
                        lineWidth: 1,
                        xaxis: {
                            from: that._markedPosition.x,
                            to: that._markedPosition.x,
                        },
                        color: "red"
                    });
                    return ret;
                },
            },
        }
    }

    TimeLine.prototype.isCloudSelected = function (cloud) {
        return this._cloudsMap[cloud.id].selected;
    }

    TimeLine.prototype._getReportsByX = function (x) {
        var report1 = null;
        var report2 = null;
        for (var i=0; i < this._reports.length; ++i) {
            if (this._reports[i].at > x) {
                report1 = this._reports[i - 1];
                report2 = this._reports[i];
                break;
            } else if (this._reports[i].at == x) {
                report1 = report2 = this._reports[i];
                break;
            }
        }
        return [report1, report2];
    }

    TimeLine.prototype._initLegend = function (idx) {
        var that = this;
        this._container.find('.legendColorBox').eq(idx).click(function () {
            var cloudId = $(this).next().text().split('.')[0];
            that._cloudsMap[cloudId].selected = !that._cloudsMap[cloudId].selected;
            that._plot = $.plot(that._container, that.hideDisabledClouds(that._plot.getData()), that._options);
            that._container.find('.legendColorBox').attr('data-color', function (idx, attr) {
                return $(this).find('div div').css('border').replace(/.*rgb/, 'rgb');
            })
            that._container.find('.legendColorBox').each(function (idx2, element) {that._initLegend(idx2)});
            var reports = that._getReportsByX(that._markedPosition.x);
            that._onDateSelected(reports[0], reports[1], that._markedPosition, that);
        });
    }

    TimeLine.prototype.hideDisabledClouds = function (data) {
        var that = this;
        for (var i=0; i < data.length; ++i) {
            var series = data[i]
            var cloudId = series.label.split('.')[0];
            var cloud = this._cloudsMap[cloudId];
            var selected = cloud.selected;
            series.lines = {show: selected};
            series.color = selected? cloud.color: '#ccc';
        }
        return data;
    }

    TimeLine.prototype.playPause = function () {
        if (!this._playing) {
            var pivot = this._markedPosition.x + this._start.getTime();
            for (var reportIdx = 0;
                    reportIdx < this._reports.length && this._reports[reportIdx].at < pivot; 
                    ++reportIdx) {
            }
            var that = this;
            this._ti = setInterval(
                    function () {
                        reportIdx = (reportIdx + 1) % that._reports.length;
                        var report = that._reports[reportIdx];
                        that.displayReport(report);
                    }, 500);
        } else {
            clearInterval(this._ti);
        }
        this._playing = !this._playing;
    }

    TimeLine.prototype.pause = function () {
        clearInterval(this._ti);
        this._playing = false;
    }

    TimeLine.prototype.getStart = function () {
        return this._start;
    }

    TimeLine.prototype.getEnd = function () {
        return this._end;
    }

    TimeLine.prototype.getReports = function () {
        return this._reports;
    }

    TimeLine.prototype.getCurrentDate = function () {
        return new Date(this._markedPosition.x);
    }

    TimeLine.prototype.setMarkedPosition = function (pos) {
        this._markedPosition = pos;
        this._plot.draw();
        var reports = this._getReportsByX(pos.x);
        this._onDateSelected(reports[0], reports[1], pos, this);
    }

    TimeLine.prototype.displayReport = function (report) {
        this._markedPosition.x = report.at;
        this._plot.draw();
        this._onDateSelected(report, report, this._markedPosition, this);
        this._updateLegendsByReport(report);
        var date = new Date(report.at)
        this._currentTimeTag.text(date.getHours() + ":" + date.getMinutes());
        this._currentTimeTag.css({
            left: this._plot.pointOffset({x: this._markedPosition.x, y: 0}).left + this._container.offset().left,
            top: this._plot.offset().top + this._plot.height() / 2,
        }).show();
    }

    TimeLine.prototype._updateLegendsByReport = function (report) {
        var cloud2latency = {};
        for (var i = 0; i < report.statusList.length; ++i) {
            var status_ = report.statusList[i];
            cloud2latency[status_['id']] = status_['latency'];
        }
        var dataset = this._plot.getData();
        for (var i = 0; i < dataset.length; ++i) {
            var series = dataset[i];
            // Find the nearest points, x-wise
            var cloudId = series.label.split('.')[0];
            this._container.find('.legendLabel').eq(i).text(series.label.replace(/-.*/, "- " + ((cloud2latency[cloudId]===null)? '当机': cloud2latency[cloudId] + "ms")));
        }
    }

    TimeLine.prototype._updateLegends = function (pos) {
        var i, j, dataset = this._plot.getData();
        for (i = 0; i < dataset.length; ++i) {
            var series = dataset[i];
            // Find the nearest points, x-wise
            var point1 = null;
            var point2 = null;
            for (j = 0; j < series.data.length; ++j) {
                if (series.data[j][0] > pos.x) {
                    point1 = series.data[j - 1];
                    point2 = series.data[j];
                    break;
                } else if (series.data[j][0] == pos.x) {
                    point1 = series.data[j];
                    point2 = series.data[j];
                    break;
                }
            }
            var latency = null;
            if (point1) {
                if (point1[1] && point2[1]) {
                    if (point1[0] == point2[0]) {
                        latency = Math.floor(point1[1]);
                    } else {
                        latency = Math.floor(point1[1] + (point2[1] - point1[1]) * (pos.x - point1[0]) / (point2[0] - point1[0]));
                    }
                }
                this._container.find('.legendLabel').eq(i).text(series.label.replace(/-.*/, "- " + ((latency===null)? '当机': latency + "ms")));
            } else {
                this._container.find('.legendLabel').eq(i).text(series.label.replace(/-.*/, "- ??"));
            }
        }
    }

    TimeLine.prototype._updateTime = function (pos) {
        this._updating = false;
        var axes = this._plot.getAxes();
        if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
            pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
            return;
        }
        var date = new Date(pos.x);
        this._currentTimeTag.text(date.getHours() + ":" + date.getMinutes());
        this._currentTimeTag.css({
            left: pos.pageX,
            top: pos.pageY - 50,
        }).show();
        this._updateLegends(pos);
    }

    TimeLine.prototype.init = function () {
        // TODO show loading
        var that = this;
        functions.getCloudReports(this._viewpoint, this._start, 
                this._end).done(function (reports) {
                    that._reports = reports;
                    var data = [];
                    var seriesMap = {};
                    var start = that._start.getTime();
                    for (var i=0; i < reports.length; ++i) {
                        var report = reports[i];
                        for (var j=0; j < report.statusList.length; ++j) {
                            var cloudStatus = report.statusList[j];
                            if (!(cloudStatus.id in seriesMap)) {
                                seriesMap[cloudStatus.id] = [];
                            }
                            seriesMap[cloudStatus.id].push([report.at, cloudStatus.latency]);
                        }
                    }
                    for (var id in seriesMap) {
                        var series = seriesMap[id];
                        data.push({
                            label: id + "." + that._cloudsMap[id].name + ' - ' + series[series.length-1][1] + "ms",
                            data: seriesMap[id]
                        });
                    }
                    that._markedPosition = {
                        x: reports[reports.length-1].at, 
                        y: null
                    };
                    if (that._markedPosition.x > 
                            that._initDate.getTime()) {
                        that._markedPosition.x = that._initDate.getTime();
                    }
                    that._plot = $.plot(that._container, that.hideDisabledClouds(data), that._options);
                    that._container.find('.legendColorBox').attr('data-color', function (idx, attr) {
                        return $(this).find('div div').css('border').replace(/.*rgb/, 'rgb');
                    })

                    that._container.find('.legendColorBox').each(function (idx, element) {that._initLegend(idx)});
                    that._onDateSelected(reports[reports.length - 1], reports[reports.length - 1], that._markedPosition, that);
                });
    }
    return {
        TimeLine: TimeLine,
    }
});
