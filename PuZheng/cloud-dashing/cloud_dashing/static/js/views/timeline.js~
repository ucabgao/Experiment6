define(['jquery', 'underscore', 'backbone', 'handlebars', 'text!/static/templates/timeline.hbs', 'collections/reports', 'collections/agents', 'models/timespot', 'common', 'utils', 'toastr', 'jquery.plot', 'jquery.plot.crosshair',
    'jquery.plot.time'],
    function ($, _, Backbone, Handlebars, timelineTemplate, Reports, agents, TimeSpot, common, utils, toastr) {
        var Timeline = Backbone.View.extend({
            _template: Handlebars.default.compile(timelineTemplate),

            initialize: function () {
                var start = new Date();
                this._start = new Date(start.getFullYear(), start.getMonth(),
                    start.getDate()).getTime();
                this._end = this._start + common.MS_A_DAY;
                toastr.options = {
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "1000",
                }
                this._playing = false;
                this.render();
            },

            events: {
                'plothover .timeline-plot': '_updateTime',
                'mouseout .timeline-plot': function (e) {
                    this._currentTimeTag.hide();
                    this._updateTimeSpot(this._markedPosition)
                },
                'plotclick .timeline-plot': function (e, pos, item) {
                    this._markedPosition = pos;
                    this._plot.draw();
                },
                'click .mode-btn': '_changeMode',
                'click .backward-btn': '_backward',
                'click .forward-btn': '_forward',
                'click .play-btn': '_playPause'
            },

            render: function () {
                this.$el.html(this._template());
                this.$container = this.$('.timeline-plot');
                this._currentTimeTag = $('<span id="currentTime"></span>').insertBefore(this.$container).css({position: 'absolute'}).hide();
                return this;
            },

            makePlot: function (viewpoint, initDate) {
                if (this._viewpoint != viewpoint || this._hasChanged == true) {
                    this._viewpoint = viewpoint;
                    if (!!initDate) {
                        this._initTime = initDate.getTime();
                    } else if (!!this._markedPosition) {
                        this._initTime = this._markedPosition;
                    }
                    this._reports = new Reports(viewpoint, this._start, this._end);
                    this._reports.fetch({reset: true});
                    this._reports.on('reset', this._renderPlot, this);
                }else{
                    this._renderPlot();
                }
            },

            _options: function () {
                var that = this;
                return {
                    xaxis: {
                        mode: 'time',
                        timezone: 'browser',
                        min: this._start,
                        max: this._end,
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
                            that._reports.each(function (report, i) {
                                for (var j = 0; j < report.get('data').length; ++j) {
                                    var status_ = report.get('data')[j];
                                    var agent = agents.get(status_.id);
                                    if (agent.selected && status_.latency == null) {
                                        var from = null;
                                        if (i == 0) {
                                            from = report.at;
                                        } else {
                                            from = that._reports.get(i - 1).at;
                                        }

                                        var to = null;
                                        if (i + 1 < that._reports.length) {
                                            to = that._reports.get(i + 1).at;
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
                                            color: agent.color,
                                        });
                                    }
                                }
                            });
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
                        margin: {
                            top: 25,
                            right: 10,
                            bottom: 10,
                            left: 10
                        }
                    },
                }
            },

            _renderPlot: function () {
                this._markedPosition = {
                    x: this._reports.last().get('time') * 1000,
                    y: null,
                }
                if (!!this._initTime && this._getMode() === 'week' && this._markedPosition.x > this._initTime) {
                    this._markedPosition.x = this._initTime
                }
                this._initTime = this._markedPosition.x
                var data = [];
                var seriesMap = {};
                this._reports.each(function (report) {
                    var netStatusList = report.get('data')["网络性能"];
                    if (!!netStatusList) {
                        for (var j = 0; j < netStatusList.length; ++j) {
                            var agentStatus = netStatusList[j];
                            if (!(agentStatus.id in seriesMap)) {
                                seriesMap[agentStatus.id] = [];
                            }
                            seriesMap[agentStatus.id].push([report.get('time') * 1000, parseFloat(agentStatus["延迟"]), parseFloat(report.get('data')["计算性能"]["分数"]),
                                parseFloat(report.get('data')["磁盘性能"]["分数"])]);
                        }
                    }
                });
                for (var id in seriesMap) {
                    data.push({
                        agentId: id,
                        data: seriesMap[id],
                    });
                }
                this._plot = $.plot(this.$container, this._hideDisabledAgents(data), this._options());
                this._updateTimeSpot(this._markedPosition);
                this._hasChanged = false;
            },

            _hideDisabledAgents: function (data) {
                for (var i = 0; i < data.length; ++i) {
                    var series = data[i];
                    var agent = agents.get(series.agentId);
                    var selected = agent.get('selected');
                    series.lines = {show: selected};
                    series.color = selected ? agent.get('color') : '#ccc';
                }
                return data;
            },

            _updateTimeSpot: function (pos) {
                var i, j, dataset = this._plot.getData();
                var data = [];
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
                    var timespot = null;
                    if (point1) {
                        if (point1[1] && point2[1]) {
                            var agent = _.find(agents.models, function (agent) {
                                return agent.get("id") == series.agentId
                            });
                            var agentName = "";
                            if (agent) {
                                agentName = agent.get("name");
                            }
                            if (point1[0] == point2[0]) {
                                timespot = new TimeSpot({agent: agent, cpu: point1[2], latency: Math.floor(point1[1]), hd: point1[3], name: agentName})
                            } else {
                                var latency = Math.floor(point1[1] + (point2[1] - point1[1]) * (pos.x - point1[0]) / (point2[0] - point1[0]));
                                timespot = new TimeSpot({agent: agent, cpu: (point1[2] + point2[2]) / 2, latency: latency, hd: (point1[3] + point2[3]) / 2, name: agentName})
                            }
                        }
                    }
                    data.push(timespot);
                }
                this.trigger('time-changed', data);
            },

            _updateTime: function (e, pos, item) {
                if (!pos) {
                    return;
                }
                this._updating = false;
                var axes = this._plot.getAxes();
                if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
                    pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
                    return;
                }
                var date = new Date(pos.x);
                this._currentTimeTag.text(date.getHours() + ":" + date.getMinutes());
                this._currentTimeTag.offset({
                    left: pos.pageX,
                    top: pos.pageY - 50,
                }).show();
                this._updateTimeSpot(pos);
            },

            _getReportsByX: function (x) {
                var report1 = null;
                var report2 = null;
                for (var i = 0; i < this._reports.length; ++i) {
                    if (this._reports.at(i).at > x) {
                        report1 = this._reports.at(i - 1);
                        report2 = this._reports.at(i);
                        break;
                    } else if (this._reports.at(i).at == x) {
                        report1 = report2 = this._reports.at(i);
                        break;
                    }
                }
                return [report1 && report1.toJSON(), report2 && report2.toJSON()];
            },

            toggleAgent: function (agent) {
                this._plot = $.plot(this.$container, this._hideDisabledAgents(this._plot.getData()), this._options());
            },

            _getMode: function () {
                return this.$(".mode-btn").text() === '日' ? 'day' : 'week';
            },

            _changeMode: function (e) {
                var start = null;
                var end = null;
                if (this._getMode() === 'day') {
                    this.$('.mode-btn').text('周');
                    this._start = utils.getMonday(this.getCurrentDate()).getTime();
                    this._end = this._start + common.MS_A_WEEK;
                } else {
                    this.$('.mode-btn').text('日');
                    var start = this.getCurrentDate();
                    this._start = new Date(start.getFullYear(), start.getMonth(),
                        start.getDate()).getTime();
                    this._end = this._start + common.MS_A_DAY;
                }
                // keep the current date
                this.pause();
                this._hasChanged = true;
                this.makePlot(this._viewpoint, this.getCurrentDate());
            },

            getCurrentDate: function () {
                return new Date(this._markedPosition.x);
            },

            _backward: function (e) {
                if (this._getMode() == 'day') {
                    var start = new Date(this._start - common.MS_A_DAY);
                    this._start = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
                    this._end = this._start + common.MS_A_DAY;
                } else {
                    this._start = new Date(utils.getMonday(this._start - common.MS_A_WEEK)).getTime();
                    this._end = this._start + common.MS_A_WEEK;
                }
                this.pause();
                this._hasChanged = true;
                this.makePlot(this._viewpoint);
            },

            _forward: function (e) {
                if (this._getMode() == 'day') {
                    var today = new Date();
                    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    if (this.getCurrentDate() >= today) {
                        toastr.warning('已经是今天了!');
                        return;
                    }
                    var start = new Date(this._start + common.MS_A_DAY);
                    this._start = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
                    this._end = this._start + common.MS_A_DAY;
                } else {
                    if (this.getCurrentDate() >= utils.getMonday(new Date())) {
                        toastr.warning('已经是最后一周了!');
                        return;
                    }
                    this._start = new Date(utils.getMonday(this._start + common.MS_A_WEEK)).getTime();
                    this._end = this._start + common.MS_A_WEEK;
                }
                this.pause();
                this._hasChanged = true;
                this.makePlot(this._viewpoint);
            },

            pause: function (e) {
                clearInterval(this._ti);
                this._playing = false;
                this.$('.play-btn i').removeClass('fa-pause').addClass('fa-play');
            },

            _playPause: function (e) {
                if (!this._playing) {
                    var pivot = this._markedPosition.x;
                    for (var reportIdx = 0;
                         reportIdx < this._reports.length && this._reports.at(reportIdx).get('at') < pivot;
                         ++reportIdx) {
                    }
                    var that = this;
                    this._ti = setInterval(
                        function () {
                            reportIdx = (reportIdx + 1) % that._reports.length;
                            var report = that._reports.at(reportIdx);
                            that._displayReport(report.toJSON());
                        }, 500);
                    this.$('.play-btn i').removeClass('fa-play').addClass('fa-pause');
                } else {
                    this.$('.play-btn i').removeClass('fa-pause').addClass('fa-play');
                    clearInterval(this._ti);
                }
                this._playing = !this._playing;
            },

            _displayReport: function (report) {
                this._markedPosition.x = report.at;
                this._plot.draw();
                var date = new Date(report.at);
                this._currentTimeTag.text(date.getHours() + ":" + date.getMinutes());
                this._currentTimeTag.offset({
                    left: this._plot.pointOffset({x: this._markedPosition.x, y: 0}).left + this.$container.offset().left,
                    top: this._plot.offset().top + this._plot.height() / 2
                }).show();
                var data = report.data.map(function (status_) {
                    var agent = _.find(agents.models, function (agent) {
                        return agent.get("id") == status_.id;
                    });
                    return new TimeSpot({
                        agent: agent,
                        name: agent.get("name"),
                        available: status_.available,
                        latency: status_.latency,
                        db: status_.db
                    });
                });
                this.trigger('time-changed', data);
            }
        });
        return Timeline;
    });