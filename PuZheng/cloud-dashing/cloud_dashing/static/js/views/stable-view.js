/**
 * Created by Young on 14-2-14.
 */
define(['jquery', 'toastr', 'backbone', 'handlebars', 'collections/daily-reports', 'common', 'utils', 'collections/agents',
    'text!/static/templates/daily-stable-view.hbs'],
    function ($, toastr, Backbone, Handlebars, DailyReports, common, utils, agents, dailyStableViewTemplate) {
        var monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

        var StableTableView = Backbone.View.extend({
            initialize: function () {
                this._start = utils.getMonday(new Date()).getTime();
                this._end = this._start + common.MS_A_WEEK;
                toastr.options = {
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "1000"
                };
                return this;
            },

            _table: function () {
                return $("<table></table>").addClass("table table-bordered table-condensed").append(this._thead()).append(this._tbody());
            },

            _thead: function () {
                return $("<thead></thead>").append($("<tr></tr>").append(this._columns()));
            },

            _tbody: function () {
                var data = {};
                if (this._dailyReports) {
                    this._dailyReports.each(function (dailyReport) {
                        for (var i = 0; i < dailyReport.get('data').length; ++i) {
                            var at = dailyReport.get("at");
                            var status_ = dailyReport.get('data')[i];
                            var agent = agents.get(status_.id);
                            if (agent.get("selected") == true) {
                                if (!(status_.id in data)) {
                                    data[status_.id] = {};
                                }
                                data[status_.id][at] = status_.crash_num;
                            }
                        }
                    });
                }
                var _dateSpans = this._getDateSpans();
                var dataColumns = _.map(data, function (value, key) {
                    var html = $("<tr></tr>");
                    html.append($("<td></td>").addClass("text-center").text(agents.get(key).get("name")));
                    _.each(_dateSpans, function (date) {
                        var val = value[date.getTime()];
                        var td = $("<td></td>").addClass("text-center");
                        if(val == undefined){
                            td.html("&nbsp;");
                        }else if (val > 0) {
                            td.html($("<i></i>").addClass("fa fa-frown-o"));
                        } else {
                            td.html($("<i></i>").addClass("fa fa-smile-o"));
                        }
                        html.append(td);
                    });
                    return html;
                });
                return $("<tbody></tbody>").append(dataColumns);
            },

            _getDateSpans: function () {
                var dateSpans = [];
                if (this._start && this._end) {
                    var time = this._start;
                    while (time < this._end) {
                        dateSpans.push(new Date(time));
                        time += common.MS_A_DAY;
                    }
                }
                return dateSpans;
            },

            _columns: function () {
                var columns = [$("<th></th>").text("云").addClass("text-center")];
                _.each(this._getDateSpans(), function (date) {
                    columns.push($("<th></th>").text(monthNames[date.getMonth()] + date.getDate()).addClass("text-center"));
                });
                return columns;
            },

            _renderReports: function () {
                if (this._dailyReports) {
                    this.$el.empty();
                    this.$el.append(this._table());
                }
            },

            updateViewpoint: function (viewpoint) {
                this._viewpoint = viewpoint;
                this._dailyReports = new DailyReports(this._viewpoint, this._start, this._end);
                this._dailyReports.fetch({reset: true});
                this._dailyReports.on('reset', this._renderReports, this);
            },

            moveBack: function () {
                this._end = this._start;
                this._start = this._start - common.MS_A_WEEK;
                this.updateViewpoint(this._viewpoint);
            },

            moveForward: function () {
                if (this._end >= new Date().getTime()) {
                    toastr.warning('已经是本周了!');
                    return;
                }
                this._start = this._end;
                this._end = this._start + common.MS_A_WEEK;
                this.updateViewpoint(this._viewpoint);
            },
            toggleAgent: function () {
                this._renderReports();
            }
        });

        var StableView = Backbone.View.extend({
            _template: Handlebars.default.compile(dailyStableViewTemplate),

            initialize: function () {
                return this;
            },
            render: function () {
                this.$el.html(this._template());
                this._stableTableView = new StableTableView({el: this.$('.stable-view')});
                return this;
            },
            updateViewpoint: function (viewpoint) {
                this._stableTableView.updateViewpoint(viewpoint);
            },

            toggleAgent: function (agent) {
                this._stableTableView.toggleAgent();
            },
            events: {
                'click .backward-btn': 'moveBack',
                'click .forward-btn': 'moveForward'
            },
            moveBack: function () {
                this._stableTableView.moveBack();
            },
            moveForward: function () {
                this._stableTableView.moveForward();
            }
        });
        return StableView;
    });