// create margins for svg
var margin = {top: 20, right: 120, bottom: 50, left: 60},
    width = 1100 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date to time format
var parseDate = d3.time.format("%b-%Y").parse;

// create scale for x axis - murders
var xScale = d3.time.scale()
               .range([0, width]);

// create scale for y axis - life expectancy
var yScale = d3.scale.linear()
               .range([height, 0]);

// create scale for the colors using colorbrewer
var colorScale = d3.scale.ordinal()
                   .range(colorbrewer.Set2[3]);

// create scale for hover colors
var colorScaleH = d3.scale.ordinal()
                    .range(colorbrewer.Dark2[3]);

// create x axis
var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");

// create y axis
var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");

// create line
var line = d3.svg.line()
             .interpolate("monotone")
             .x(function(d) { return xScale(d.date); })
             .y(function(d) { return yScale(d.count); });

// get month from date and format
var monthName = d3.time.format("%B");
var format = d3.format("0,000");

// create svg for c level functionality
var svg = d3.select("#chartC")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0.9);

// load in the data and add to svg
d3.csv("hw3/seatbelt_chart1.csv", function(error, data) {
      window.onload = generate(data);

    // window.onload = d3.select("input#drivers").property("checked", true)
    //                 d3.select("input#front").property("checked", true)
    //                 d3.select("input#rear").property("checked", true);

})

function generate(data) {

    // add color into data
    colorScale.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    // add new date into data
    data.forEach(function(d) { d.date = parseDate(d.date); });

    // create objects with data for each line
    var seatbelts = colorScale.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {date: d.date, count: +d[name]};
            })
        };
    });

    // create the scale domain for the x axis
    xScale.domain(d3.extent(data, function(d) { return d.date; }));

    // create scale domain for the y axis based on max value
    yScale.domain([0, d3.max(seatbelts, function(c) { return d3.max(c.values, function(v) { return v.count; }); }) ]);

    // add x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // add x axis label
    svg.append("text")
        .attr("x", width/2)
        .attr("y",  height + margin.bottom - 5)
        .style("text-anchor", "middle")
        .text("Date");

    // add y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // add y axis label
    svg.append("text")
        .attr("transform", "rotate(-90) translate(-10, 0)")
        .attr("y", 0 - margin.left + 5)
        .attr("x", 0 - height/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Deaths/Injuries");

    // create all points of each line
    var deaths = svg.selectAll(".deaths")
                    .data(seatbelts)
                    .enter()
                    .append("g")
                    .attr("class", "deaths");

    // add the lines between each point
    deaths.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return colorScale(d.name); });

    // add text to end of lines
    deaths.append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + xScale(d.value.date) + "," + yScale(d.value.count) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) { if (d.name==="front"){ 
              return "Front Passengers"; 
            } if (d.name==="rear") { 
              return "Rear Passengers"; 
            } else {
              return "Drivers";
            }});

    // add dots for each point
    dots = svg.selectAll(".dots")
              .data(seatbelts)
              .enter()
              .append("g")
              .style("fill", function(d) { return colorScaleH(d.name); })
              .attr("class", "points");

    // show the points on a mouseover
    dots.selectAll(".point")
        .data(function(d) { return d.values; })
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) { return xScale(d.date); }) 
        .attr("cy", function(d) { return yScale(d.count); }) 
        .attr("r", 5)
        .style("opacity", 0)
        .on("mouseover", function(d) {
            tooltip.transition()
                   .style("opacity",1);
            tooltip.html("<span><b>Killed or seriously injured</b>: " + format(d.count) +" </span><br>" +
                          "<span><b>Month</b>: " + monthName(d.date) + "</span><br>" +
                          "<span><b>Year</b>: " + d.date.getFullYear() + "</span><br>")
                   .style("left", (event.pageX + 15) + "px")     
                   .style("top", (event.pageY - 20) + "px"); 
            d3.select(this).style("opacity", 1); 
          })
        .on("mouseout", function(d){
            tooltip.transition()
                   .style("opacity", 0);
            d3.select(this).style("opacity", 0); });
}

// function filter_year() {
//     var year = document.getElementById('year').value;
//     console.log(year);
//     d3.csv("hw3/seatbelt_chart1.csv", function(error, data) {
//         console.log(data);
//         datafilter = data.filter(function(d){console.log(parseDate(d.date).getFullYear()); return parseDate(d.date).getFullYear() === +year});
//         console.log(datafilter);
//         generate(datafilter);
//       })
// }