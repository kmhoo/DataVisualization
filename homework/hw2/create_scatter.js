// set size of each plot and padding
var size = 150;
var padding = 15;
var n = 5;
var marginB = 150;

// create the color scale by region
var colorScale = d3.scale.ordinal()
                         .range(colorbrewer.Set2[4]);

// create svg for b level functionality
var svgB = d3.select("#chartB")
             .append("svg")
             .attr("width", size * n + 2 * padding + marginB)
             .attr("height", size * n + 2 * padding)
             .append("g")
             .attr("transform", "translate(" + padding / 2 + "," + padding / 2 + ")");

// load data and add to svg
d3.csv("hw2/state.csv", function(error, data) {

    // add color into object 
    data.forEach(function(d){ d.color = colorScale(d.region) })

    // create empty scales that will be updated for each plot
    var xScaleB = {};
    var yScaleB = {};

    // create array of all variables we want to see in matrix
    var variables = ["life_expectancy", "murders", "income", "hs_grad", "illiteracy"];

    // create dictionary for renaming
    var variableRename = {"life_expectancy": "Life Expectancy", "murders": "Murders", "income": "Income", 
                          "hs_grad": "HS Grad Rate", "illiteracy": "Illiteracy"};

    // create different x and y scales for each variable
    variables.forEach(function(variable) {
        data.forEach(function(d) { d[variable] = +d[variable]; });
        xScaleB[variable] = d3.scale.linear()
                              .domain(d3.extent(data, function(d) { return d[variable]; }))
                              .nice()
                              .range([padding, size - padding]);
                                        
        yScaleB[variable] = d3.scale.linear()
                              .domain(d3.extent(data, function(d) { return d[variable]; }))
                              .nice()
                              .range([size - padding, padding]);                                  
    }); 

    // create the axes
    var axis = d3.svg.axis()
                     .ticks(4)
                     .tickSize(size * n); 

    // create x axis for each plot
    svgB.selectAll(".x.axis")
        .data(variables)
        .enter()
        .append("g")
        .attr("class", "scatter x axis")
        .attr("transform", function(d, i) { return "translate(" + i * size + ",0)"; })
        .each(function(d)  { d3.select(this).call(axis.scale(xScaleB[d]).orient("bottom")); });

    // create y axis for each plot 
    svgB.selectAll(".y.axis")
        .data(variables)
        .enter()
        .append("g")
        .attr("class", "scatter y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) { d3.select(this).call(axis.scale(yScaleB[d]).orient("right"));  });


    // create cell and plots
    var cell = svgB.selectAll(".cell")
                   .data(cross(variables, variables))
                   .enter()
                   .append("g")
                   .attr("class", "cell")
                   .attr("transform", function(d) { return "translate(" + d.i * size + "," + d.j * size + ")"; })
                   .each(plot);

    // create titles for the diagonal
    cell.filter(function(d) { return d.i == d.j; }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function(d) { return variableRename[d.x]; });

    // create objects with region and color
    var colors = d3.entries(create_colors(data))

    // create a legend for color and region
    var legend = svgB.selectAll('.legend')
                    .data(colors)
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', function(d, i) { 
                        return 'translate(' + (size * n + 2 * padding) + ',' + (i * 25) + ')';
                    });

    // fill circles with colors
    legend.append('circle')
          .attr('r',7)
          .style('fill', function(d) { return d.value; })
          .style('opacity', .95)
          .style('stroke', 'black');

    // add the region name
    legend.append('text')
          .attr('x', 15)
          .attr('y', 5)
          .text(function(d) { return d.key; });

    // function to return the position of the circle
    function position(dot) {
    dot.attr("cx", function(d) { return xScale(x(d)); })
       .attr("cy", function(d) { return yScale(y(d)); })
       .attr("r", function(d) { return radiusScale(radius(d)); });
    }

    // function to create all the scatter plots
    function plot(p) {
      var cell = d3.select(this);

      // create plot frame
      cell.append("rect")
          .attr("class", "frame")
          .attr("opacity", "1")
          .attr("x", padding / 2)
          .attr("y", padding / 2)
          .attr("width", size - padding)
          .attr("height", size - padding);

      // create points in each frame
      cell.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", function(d) { return d.region; })
          .attr("cx", function(d) { return xScaleB[p.x](d[p.x]); })
          .attr("cy", function(d) { return yScaleB[p.y](d[p.y]); })
          .attr("r", 3)
          .attr("opacity", "0.8")
          .attr("fill", function(d) { return colorScale(d.region); })
          .attr("stroke", "#000");

    }

    // create object of colors and regions
    function create_colors(data) {
        colors = {}
        for  (var i = 0; i < data.length; i++) {
            colors[data[i].region] = data[i].color;
        };
        return colors
    }

    // function to show cross product of all variables
    function cross(a, b) {
      var c = [], n = a.length, m = b.length, i, j;
      for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
      return c;
    }

  })
