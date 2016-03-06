define(['backbone', 'views/avg-daily-latency', 'views/cpu-score-view', 'views/hd-score-view'], 
        function (Backbone, AvgDailyLatencyView, CpuScoreView, HdScoreView) {
            var StatView = Backbone.View.extend({

                initialize: function () {
                    this._avgDailyLatencyView = new AvgDailyLatencyView();
                    this.$el.append(this._avgDailyLatencyView.render().el);
                    this._cpuScoreView = new CpuScoreView();
                    this.$el.append(this._cpuScoreView.render().el);
                    this._hdScoreView = new HdScoreView();
                    this.$el.append(this._hdScoreView.render().el);
                    return this; 
                },

                updateViewpoint: function (viewpoint) {
                    this._avgDailyLatencyView.updateViewpoint(viewpoint);
                    this._cpuScoreView.updateViewpoint(viewpoint);
                    this._hdScoreView.updateViewpoint(viewpoint);
                },

                toggleAgent: function (agent) {
                    this._avgDailyLatencyView.toggleAgent(agent);
                },

            });

            return StatView;
        });
