define(['handlebars', 'collections/daily-net-reports', 'collections/agents', 'text!/static/templates/avg-daily-latency.hbs', 'views/stat-bar-plot'], 
        function (Handlebars, DailyNetReports, agents, avgDailyLatencyTemplate, StatBarPlot) {
            var AvgDailyLatencyView = StatBarPlot.extend({

                _template: Handlebars.default.compile(avgDailyLatencyTemplate),

                getDailyReports: function () {
                    return new DailyNetReports(this._viewpoint, this._start, this._end);
                },

                container: function () {
                    return this.$('.avg-latency');
                },
                
                _renderPlot: function () {
                    var data = [];
                    var seriesMap = {};
                    this._dailyReports.each(function (dailyReport) {
                        for (var i=0; i < dailyReport.get('data').length; ++i) {
                            var status_ = dailyReport.get('data')[i];
                        if (!(status_.id in seriesMap)) {
                            seriesMap[status_.id] = [];
                        }
                        seriesMap[status_.id].push([dailyReport.get('time') * 1000,  
                            status_.latency]);
                        }
                    });
                    for (var id in seriesMap) {
                        data.push({
                            data: seriesMap[id],
                            bars: {
                                show: true,
                                lineWidth: 0,
                                fill: true,
                                fillColor: agents.get(id).get('color'),
                                align: 'left',
                            },
                            agentId: id,
                        });
                    }
                    var barWidth = (22 * 60 * 60 * 1000) / data.length;    
                    data.forEach(function (series, i) {
                        series.bars.barWidth = barWidth;
                        series.data = series.data.map(function (point) {
                            return [point[0] - 11 * 60 * 60 * 1000 + i * barWidth, point[1]]
                        });
                    });
                    this._plot = $.plot(this.container(), this._hideDisabledAgents(data), this._options());
                    this._hasChanged = false;
                },

                _hideDisabledAgents: function (data) {
                    
                    for (var i=0; i < data.length; ++i) {
                        var series = data[i];
                        var agent = agents.get(series.agentId);
                        var selected = agent.get('selected');
                        series.bars.show = selected;
                    }
                    
                    return data;
                },

                toggleAgent: function (agent) {
                    this._plot = $.plot(this.$container, this._hideDisabledAgents(this._plot.getData()), this._options());
                },

            });
            return AvgDailyLatencyView;
        });
