/// <reference path="jquery.d.ts" />
var jsonObj = $, _a = void 0, MatlabObjX = _a.MatlabObjX, opts = _a.opts, _b = _a.barVals, barVals = _b === void 0 ? as : _b, JSON = _a.JSON;
var peaks = [];
var chart;
var defaultCutoff = $, _c = void 0, MatlabObjX = _c.MatlabObjX, opts = _c.opts, _d = _c.blank, blank = _d === void 0 ?  * 100 : _d;
var graphData = [
    { "key": "QC Samples", "bar": true, "values": barData() },
    { "key": "Blank Correction Cutoff", "values": lineData() }
];
function barData() {
    peaks = [];
    $.each(jsonObj, function (index, area) {
        var vals = [];
        $.each(area, function (i, value) {
            if (value > 0) {
                vals.push({ x: i, y: value });
            }
        });
        peaks[index] = vals;
    });
    return peaks[0].concat(peaks[1]);
}
function lineData(yAxisVal) {
    var cutoffValsSeries = [];
    if (!yAxisVal)
        yAxisVal = defaultCutoff;
    for (var i = 0; i < peaks[0].concat(peaks[1]).length; i++) {
        cutoffValsSeries.push({ x: i, y: yAxisVal });
    }
    return cutoffValsSeries;
}
/*
 var aMap = { "key": "QC Samples", "bar": true, "values": peaks[0].concat(peaks[1]) }, bMap = { "key": "Blank Correction Cutoff", "values": cutoffValsSeries};

 var combineData = [aMap, bMap];
 var max = combineData[0].values[combineData[0].values.length - 1].y;
 */
// register drop down change event
$(function () {
    $("#blank").change(function () {
        graphData[1].values = lineData(this.value);
        //aMap = { "key": "QC Samples", "bar": true, "values": peaks[0].concat(peaks[1]) }, bMap = { "key": "Blank Correction Cutoff", "values": cutoffValsSeries};
        //combineData = [aMap, bMap];
        //max = combineData[0].values[combineData[0].values.length - 1].y;
        redraw();
    });
});
function redraw() {
    d3.select('#chart1 svg')
        .datum(graphData)
        .transition().duration(500)
        .call(chart);
}
nv.addGraph(function () {
    chart = nv.models.linePlusBarChart()
        .margin({ top: 30, right: 60, bottom: 50, left: 80 })
        .x(function (d, i) {
        return i;
    })
        .color(d3.scale.category10().range());
    /*
     chart.xAxis.tickFormat(function (d) {
     var dx = combineData[0].values[d] && combineData[0].values[d].x || 0;
     return dx;
     });
     */
    chart.xAxis
        .axisLabel('Metabolite #');
    chart.y1Axis
        .axisLabel('%')
        .tickFormat(function (d) {
        return d3.format(',f')(d) + '%';
    });
    chart.y2Axis
        .tickFormat(function (d) {
        //return d3.format(",d")(d)
        return;
    }).tickValues([0, 100]);
    //}).tickValues([0,10,20,30,40,50,60,70,80,90,100])
    chart.bars.forceY([0, 100]);
    chart.bars.forceX([0, peaks[0].concat(peaks[1]).length] + 1);
    chart.lines.forceY([0, 100]);
    d3.select('#chart1 svg')
        .datum(graphData)
        .transition().duration(500).call(chart);
    nv.utils.windowResize(chart.update);
    chart.dispatch.on('stateChange', function (e) {
        nv.log('New State:', JSON.stringify(e));
    });
    return chart;
});
