define(['jquery', 'backbone', 'toastr', 'common', 'utils', 'collections/agents', 'jquery.plot', 'jquery.plot.time', 'jquery.plot.tooltip'], 
        function ($, Backbone, toastr, common, utils, agents) {
            var StatBarPlot = Backbone.View.extend({

                initialize: function () {
                    this._start = utils.getMonday(new Date()).getTime();
                    this._end = this._start + common.MS_A_WEEK;
                    toastr.options = {
                        "positionClass": "toast-bottom-full-width",
                        "timeOut": "1000",
                    }
                },
                
                events: {
                    'click .backward-btn': 'moveBack',
                    'click .forward-btn': 'moveForward',
                },

                render: function () {
                    this.$el.html(this._template());
                    return this; 
                },

                _options: function () {
                    return {
                        xaxis: {
                            mode: 'time',
                            timezone: 'browser',
                            min: this._start - common.MS_A_DAY/2,
                            max: this._end - common.MS_A_DAY/2,
                        },
                        series: {
                            lines: { show: false },
                            points: { show: false }
                        },
                        grid: {
                            clickable: true,
                            hoverable: true,
                            borderWidth: {
                                top: 0,
                                right: 0,
                                bottom: 1,
                                left: 1
                            },
                        },
                        tooltip: true,
                        tooltipOpts: {
                            content: '%y',
                        },
                    };
                },
                

                updateViewpoint: function (viewpoint) {
                    if (this._viewpoint !=viewpoint || this._hasChanged == true) {
                        this._viewpoint = viewpoint;
                        this._dailyReports = this.getDailyReports();
                        this._dailyReports.fetch({reset: true});
                        this._dailyReports.on('reset', this._renderPlot, this);
                    }else{
                        this._renderPlot();
                    }
                },

                moveBack: function () {
                    this._end = this._start;
                    this._start = this._start - common.MS_A_WEEK;
                    this._hasChanged = true;
                    this.updateViewpoint(this._viewpoint);
                },
                
                moveForward: function () {
                    if (this._end >= new Date().getTime()) {
                        toastr.warning('已经是本周了!'); 
                        return;
                    }
                    this._start = this._end;
                    this._end = this._start + common.MS_A_WEEK;
                    this._hasChanged = true;
                    this.updateViewpoint(this._viewpoint);
                },
            });
            return StatBarPlot;
        });
