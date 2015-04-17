// create margins
var marginA = {top: 30, right: 100, bottom: 10, left: 80},
    widthA = 1100 - marginA.right - marginA.left,
    heightA = 800 - marginA.top - marginA.bottom;

// create x scale (ordinal for each of the coordinates)
var xScaleA = d3.scale.ordinal()
                .rangePoints([0, widthA], 1);

// create empty y scale (set with the data)
var yScaleA = {};

// create empty dragging variable 
var dragging = {};

// create svg line
var line = d3.svg.line();

// create axis
var axis = d3.svg.axis()
             .orient("left");

// create empty variables
var background;
var foreground;

// create color scale for regions
var colorScale = d3.scale.ordinal()
                   .range(colorbrewer.Set2[4]);

// create svg for a level functionality
var svgA = d3.select("#chartA")
             .append("svg")
             .attr("width", widthA + marginA.right + marginA.left)
             .attr("height", heightA + marginA.top + marginA.bottom)
             .append("g")
             .attr("transform", "translate(" + marginA.left + "," + marginA.top + ")");

// load in the data and add to svg
d3.csv("hw2/state.csv", function(error, data) {

    // add color into data
    data.forEach(function(d){ d.color = colorScale(d.region) })

    // json of dimensions and adjusted titles
    var cols = {"name": "State", "population": "Population", "life_expectancy": "Life Expectancy", "income": "Income", 
                "illiteracy": "Illiteracy", "murders": "Murders", "hs_grad": "HS Grad Rate",
                "days_frost": "Days w/ Frost", "land_area": "Land Area"}

    // list of dimensions and create scale for each (excluding all categorical data but state name)
    xScaleA.domain(dimensions = d3.keys(data[0]).filter(function(d) {
        if(d == "region") return false;
        if (d === "name") { return d == "name" &&
          (yScaleA[d] = d3.scale.ordinal()
                          .domain(data.map(function(p) { return p[d]; }))
                          .rangePoints([heightA, 0]));
        } 
        else { return d != "abb" && d != "region" && d != "division" && d != "color" &&
            (yScaleA[d] = d3.scale.linear()
                            .domain(d3.extent(data, function(p) { return +p[d]; }))
                            .range([heightA, 0]));
          }
      }));

    // add grey background lines for context
    background = svgA.append("g")
                     .attr("class", "background")
                     .selectAll("path")
                     .data(data)
                     .enter()
                     .append("path")
                     .attr("d", path);

    // add foreground lines for focus (colored by region)
    foreground = svgA.append("g")
                     .attr("class", "foreground")
                     .selectAll("path")
                     .data(data)
                     .enter()
                     .append("path")
                     .attr("d", path)
                     .style("stroke", function(d) { return colorScale(d.region); });


    // add group elements for each dimension
    var grp = svgA.selectAll(".dimension")
                  .data(dimensions)
                  .enter()
                  .append("g")
                  .attr("class", "dimension")
                  .attr("transform", function(d) { return "translate(" + xScaleA(d) + ")"; })
                  .call(d3.behavior.drag()
                  .on("dragstart", function(d) {
                      dragging[d] = this.__origin__ = x(d);
                      background.attr("visibility", "hidden");
                  })
                  .on("drag", function(d) {
                      dragging[d] = Math.min(widthA, Math.max(0, this.__origin__ += d3.event.dx));
                      foreground.attr("d", path);
                      dimensions.sort(function(a, b) { return position(a) - position(b); });
                      x.domain(dimensions);
                      grp.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                  })
                  .on("dragend", function(d) {
                      delete this.__origin__;
                      delete dragging[d];
                      transition(d3.select(this)).attr("transform", "translate(" + xScaleA(d) + ")");
                      transition(foreground).attr("d", path);
                      background.attr("d", path)
                                .transition()
                                .delay(500)
                                .duration(0)
                                .attr("visibility", null);
                  }));

  // add an axis and title
    grp.append("g")
       .attr("class", "axis")
       .each(function(d) { d3.select(this).call(axis.scale(yScaleA[d])); })
       .append("text")
       .attr("text-anchor", "middle")
       .attr("y", -9)
       .text(function(d) {return cols[d]} );

  // add and store a brush for each axis
    grp.append("g")
       .attr("class", "brush")
       .each(function(d) { d3.select(this).call(yScaleA[d].brush = d3.svg.brush().y(yScaleA[d]).on("brushstart", brushstart).on("brush", brush)); })
       .selectAll("rect")
       .attr("x", -8)
       .attr("width", 16);

    // create objects with region and color
    var colors = d3.entries(create_colors(data))

    // create a legend for color and region
    var legend = svgA.selectAll('.legend')
                     .data(colors)
                     .enter()
                     .append('g')
                     .attr('class', 'legend')
                     .attr('transform', function(d, i) { 
                         return 'translate(' + (widthA - 20) + ',' + (i * 25) + ')';
                     });

    // add color to the circles
    legend.append('rect')
          .attr('width', 40)
          .attr('height', 2)
          .style('fill', function(d) { return d.value; })
          .style("text-anchor", "middle")
          .style('opacity', .95);

    // add the region name
    legend.append('text')
          .attr('x', 15)
          .attr('y', 15)
          .text(function(d) { return d.key; });

    // create object of colors and regions
    function create_colors(data) {
        colors = {}
        for  (var i = 0; i < data.length; i++) {
            colors[data[i].region] = data[i].color;
        };
        return colors
    }

})

// returns position
function position(d) {
    var v = dragging[d];
    return v == null ? xScaleA(d) : v;
}

// transition funfction
function transition(g) {
    return g.transition().duration(500);
}

// returns the path for a given data point
function path(d) {
    return line(dimensions.map(function(p) { return [position(p), yScaleA[p](d[p])]; }));
}

// when brushing, don’t trigger axis dragging
function brushstart() {
    d3.event.sourceEvent.stopPropagation();
}

// handles a brush event, toggling the display of foreground lines
function brush() {
    var actives = dimensions.filter(function(p) { return !yScaleA[p].brush.empty(); });
    var extents = actives.map(function(p) { return yScaleA[p].brush.extent(); });
    foreground.style("display", function(d) {
        return actives.every(function(p, i) {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        }) ? null : "none";
    });
}
