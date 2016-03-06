define(['jquery', 'backbone', 'backgrid', 'collections/timespots', 'collections/agents', 'models/timespot'], function ($, Backbone, Backgrid, timespots, agents, TimeSpot) {
    var columns = [
        {
            name: "name",
            label: "云",
            editable: false,
            cell: "string"
        },
        {
            name: "cpu",
            label: "CPU得分",
            editable: false,
            cell: "number"
        },
        {
            name: "latency",
            label: "延迟（ms）",
            editable: false,
            cell: "integer"
        },
        {
            name: "hd",
            label: "hd得分",
            editable: false,
            cell: "number"
        }
    ];

    var TableView = Backgrid.Grid.extend({
        updateStatus: function (data) {
            this._timespots = data;
            this._updateTimeSpot();
        },
        toggleAgent: function () {
            this._updateTimeSpot();
        },
        _updateTimeSpot: function () {
            if (this._timespots) {
                timespots.reset();
                $.each(this._timespots, function (idx, value) {
                    if (value && value.get("agent").get("selected")) {
                        timespots.add(value);
                    }
                });
            }
        }
    });

    return new TableView({columns: columns,
        collection: timespots});
});
