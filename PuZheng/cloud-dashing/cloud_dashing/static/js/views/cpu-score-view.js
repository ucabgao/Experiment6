define(['handlebars', 'views/stat-bar-plot', 'text!/static/templates/cpu-score-view.hbs', 'collections/daily-cpu-reports', 'collections/agents'], function (Handlebars, StatBarPlot, cpuScoreViewTemplate, DailyCpuReports, agents) {
    
    var CpuScoreView = StatBarPlot.extend({
        _template: Handlebars.default.compile(cpuScoreViewTemplate),

        getDailyReports: function () {
            return new DailyCpuReports(this._viewpoint, this._start, this._end);
        },

        container: function () {
            return this.$('.cpu-score');
        },

        _renderPlot: function () {
            var data = [];
            var series = [];
            this._dailyReports.each(function (dailyReport) {
                series.push([dailyReport.get('time') * 1000,  
                    parseInt(dailyReport.get('data')['计算性能']['分数'])]);
            });
            data.push({
                data: series,
                bars: {
                    show: true,
                    lineWidth: 0,
                    fill: true,
                    fillColor: agents.get(this._viewpoint.id).get('color'),
                    align: 'center',
                    barWidth: (4 * 60 * 60 * 1000),
                },
            });
            this._plot = $.plot(this.container(), data, this._options());
            this._hasChanged = false;
        },
    });

    return CpuScoreView;
});
