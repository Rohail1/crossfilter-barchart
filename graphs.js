/**
 * Created by Rohail on 7/6/2017.
 */

let data = [
  {date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
  {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
  {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 50, type: "tab"},
  {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash"},
  {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab"},
  {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash"},
  {date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"}
];
data.forEach(d => {d.date = new Date(d.date)});
let facts = crossfilter(data);
let typeDimension = facts.dimension(function (d) {return d.type;});
let totalDimension = facts.dimension(function (d) {return d.total;});
let dateDimension = facts.dimension(function (d) {return d.date;});
let scatterPlotDimension = facts.dimension(function (d) {return [d.total,d.tip];});
let typeGroup = typeDimension.group();
let scatterGroup = scatterPlotDimension.group();
let totalGroup = totalDimension.group(d => Math.floor(d/100) * 100);
let dateGroupTotal = dateDimension.group().reduceSum(d => d.total);
let dateGroupTip = dateDimension.group().reduceSum(d => d.tip);


dc.barChart('#barChart')
  .dimension(typeDimension)
  .group(typeGroup)
  .x(d3.scale.ordinal())
  .xUnits(dc.units.ordinal);

let barchatByTotalDimension = dc.barChart('#barChartByTotalSum')
  .dimension(totalDimension)
  .group(totalGroup)
  .x(d3.scale.linear().domain([0,400]))
  .xUnits(dc.units.fp.precision(100));
barchatByTotalDimension.yAxis().ticks(5);
barchatByTotalDimension.xAxis().ticks(5);

let lineChart = dc.lineChart('#lineChart')
  .dimension(dateDimension)
  .group(dateGroupTotal)
  .stack(dateGroupTip)
  .renderArea(true) // set it to false for Line Chart
  .x(d3.time.scale().domain([dateDimension.bottom(1)[0].date,dateDimension.top(1)[0].date]));
lineChart.yAxis().ticks(5);
lineChart.xAxis().ticks(5);

let scatterPlot = dc.scatterPlot('#scatterPlot')
  .dimension(scatterPlotDimension)
  .group(scatterGroup)
  .symbol("cross")
  .symbolSize(20)
  .clipPadding(20)
  .colorAccessor(d => d.value)
  .colors(d3.scale.category10())
  .yAxisLabel("Tip")
  .xAxisLabel("Total")
  .x(d3.scale.linear().domain([0,300]));

scatterPlot.yAxis().ticks(5);
scatterPlot.xAxis().ticks(5);


let bubbleChart = dc.bubbleChart('#bubbleChart')
  .margins({top :20,bottom:50,left:20,right :20})
  .dimension(scatterPlotDimension)
  .group(scatterGroup)
  .clipPadding(70)
  .colorAccessor(d => d.key[0])
  .colors(colorbrewer.RdPu[6])
  .colorDomain([0,320])
  .keyAccessor(d => d.key[0])
  .valueAccessor(d => d.key[1])
  .radiusValueAccessor(d => d.value)
  .maxBubbleRelativeSize(0.08)
  .yAxisLabel("Tip")
  .xAxisLabel("Total")
  .renderHorizontalGridLines(true)
  .renderVerticalGridLines(true)
  .r(d3.scale.linear().domain([1,6]))
  .x(d3.scale.linear().domain([0,300]))
  .y(d3.scale.linear().domain([0,300]));

bubbleChart.yAxis().ticks(5);
bubbleChart.xAxis().ticks(5);


let dataTable = dc.dataTable('#dataTable')
  .dimension(dateDimension)
  .showGroups(false)
  // .size(10)
  .group(d => d.type)
  .columns(["date","quantity","total","tip","type"])
  .sortBy(function(d) {return d.tip})
  .order(d3.ascending);

dc.renderAll();