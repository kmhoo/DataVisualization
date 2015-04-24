// create margins for svg
var margin3 = {top: 20, right: 120, bottom: 50, left: 60},
    width3 = 1200 - margin3.left - margin3.right,
    height3 = 500 - margin3.top - margin3.bottom;

// parse the date to time format
var parseDate3 = d3.time.format("%b-%Y").parse;

// create scale for x axis - murders
var xScale3 = d3.time.scale()
                .range([0, width3]);

// create scale for y axis - life expectancy
var yScale3 = d3.scale.linear()
                .range([height3, 0]);

// create x axis
var xAxis3 = d3.svg.axis()
               .scale(xScale3)
               .orient("bottom");

// create y axis
var yAxis3 = d3.svg.axis()
               .scale(yScale3)
               .orient("left");

// create area
var area3 = d3.svg.area()
              .x(function(d) { return xScale3(d.date); })
              .y0(height3)
              .y1(function(d) { return yScale3(d.kms); });

// create svg for c level functionality
var svg3 = d3.select("#chartC3")
             .append("svg")
             .attr("width", width3 + margin3.left + margin3.right)
             .attr("height", height3 + margin3.top + margin3.bottom)
             .append("g")
             .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

// load in the data and add to svg
d3.csv("hw3/seatbelt_chart2.csv", function(error, data) {

    // add correct parsed date to each and change to numbers
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.kms = +d.kms;
    });

    // creat domains for both axes
    xScale3.domain(d3.extent(data, function(d) { return d.date; }));
    yScale3.domain([0, d3.max(data, function(d) { return d.kms; })]);

    // add path for the area
    svg3.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area3);

    // add x axis
    svg3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height3 + ")")
        .call(xAxis3);

    // add y axis
    svg3.append("g")
        .attr("class", "y axis")
        .call(yAxis3)

    // add y axis label
    svg3.append("text")
        .attr("transform", "rotate(-90) translate(-10, 0)")
        .attr("y", 0 - margin3.left + 5)
        .attr("x", 0 - height3/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Distance Driven");


})

