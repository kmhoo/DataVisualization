
var marginB = {top: 20, right: 50, bottom: 50, left: 50};

var widthB = 1000,
    sizeB = 170,
    paddingB = 15;

var xScaleB = d3.scale.linear()
               .range([paddingB / 2, sizeB - paddingB / 2]);

var yScaleB = d3.scale.linear()
               .range([sizeB - paddingB / 2, paddingB / 2]);

var xAxisB = d3.svg.axis()
              .scale(xScaleB)
              .orient("bottom")
              .ticks(5);

var yAxisB = d3.svg.axis()
              .scale(yScaleB)
              .orient("left")
              .ticks(5);

var colorB = d3.scale.ordinal()
              .range(colorbrewer.Set2[4]);

d3.csv("hw2/state.csv", function(data) {

    // var metrics = {"life_expectancy":"", "murders":"", "income":"", "hs_grad":"", "illiteracy": ""}
    var variables = ["life_expectancy", "murders", "income", "hs_grad", "illiteracy"];

        variables.forEach(function(metric) {
        var value = function(d) { return d[metric]; },
            domain = [d3.min(data, value), d3.max(data, value)];
        xScaleB[metric] = d3.scale.linear().domain(domain).nice();
        yScaleB[metric] = d3.scale.linear().domain(domain).nice();
    });


    // var variables = d3.keys(data[0]).filter(function(d) { if (d in metrics){ return d }; });
    var n = variables.length;

    // var datadict = {};
    // variables.forEach(function(i) {
    //     datadict[i] = d3.extent(data, function(d) { return d[i]; });
    // });

  var svgB = d3.select("#chartB")
              .append("svg")
              .attr("width", sizeB * n + paddingB)
              .attr("height", sizeB * n + paddingB)
              .append("g")
              .attr("transform", "translate(" + paddingB + "," + paddingB / 2 + ")");

  svgB.selectAll(".x.axis")
      .data(variables)
    .enter().append("g")
      .attr("class", "x axis")
      .attr("transform", function(d, i) { return "translate(" + i * sizeB + ",0)"; })
      .each(function(d) { d3.select(this).call(xAxisB); });

  svgB.selectAll(".y.axis")
      .data(variables)
    .enter().append("g")
      .attr("class", "y axis")
      .attr("transform", function(d, i) { return "translate(0," + i * sizeB + ")"; })
      .each(function(d) { d3.select(this).call(yAxisB); });

  var cell = svgB.selectAll(".cell")
      .data(cross(variables, variables))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * sizeB + "," + d.j * sizeB + ")"; })
      .each(plot);

  // Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; }).append("text")
      .attr("x", paddingB)
      .attr("y", paddingB)
      .attr("dy", ".71em")
      .text(function(d) { return d.x; });

  function plot(p) {
    var cell = d3.select(this);

    // xScaleB.domain(datadict[p.x]).nice();
    // yScaleB.domain(datadict[p.y]).nice();

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", paddingB / 2)
        .attr("y", paddingB / 2)
        .attr("width", sizeB - paddingB)
        .attr("height", sizeB - paddingB)
        .style("stroke", "#9999");

    cell.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cx", function(d) { return xScaleB(d[p.x]); })
        .attr("cy", function(d) { return yScaleB(d[p.y]); })
        .attr("r", 3)
        .style("fill", function(d) { return colorB(d.region); });
  }

  function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
  }

  // d3.select(self.frameElement).style("height", sizeB * n + paddingB + 20 + "px");
});