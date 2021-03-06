// set all variables for each of the charts
// chart 1 - stacked bar chart
// chart 2 - scatter plot matrix
// chart 3 - parallel coordinates

// create margins, widths and heights
var margin1 = {top: 60, right: 30, bottom: 50, left: 60},
	width1 = 355 - margin1.left - margin1.right,
	height1 = 451 - margin1.top - margin1.bottom;

// create x scales
var xScale1 = d3.scale.ordinal()
                .rangeRoundBands([0, width1], .1);

// create y scales 
var yScale1 = d3.scale.linear()
             	.rangeRound([height1, 0]);

// create color scales (ordinal)
var colorScale1 = d3.scale.ordinal()
                    .range(["#fdc086","#beaed4"]);

// create axes based on scales
var xAxis1 = d3.svg.axis()
               .scale(xScale1)
               .orient("bottom");

var yAxis1 = d3.svg.axis()
               .scale(yScale1)
               .orient("left");

// create svg images
var svg1 = d3.select("svg#bar")
    		 .attr("width", width1 + margin1.left + margin1.right)
   			 .attr("height", height1 + margin1.top + margin1.bottom)
    	     .append("g")
  		     .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

// create tooltip for the hover 
var tooltip1 = d3.select("body").append("div")   
    			 .attr("class", "tooltip")               
   				 .style("opacity", 0.9);

// create titles for plots
var title1 = svg1.append("text")
				 .attr("class", "title")
    		     .attr("x", (width1 / 2))             
   			     .attr("y", 0 - (margin1.top / 2))
   			     .attr("text-anchor", "middle")  
   			     .text("Distribution of Wine Quality by Type");


// create variables for scatter

// create color scale 
var colorScale2 = d3.scale.ordinal()
                    .range(["#fdc086","#beaed4"]);

// set size of each plot and padding
var size2 = 85;
var padding2 = 7;
var n2 = 5;
var margin2 = 60;

// create svg images
var svg2 = d3.select("svg#scatter")
             .attr("width", size2 * n2 + 2 * padding2 + margin2)
             .attr("height", size2 * n2 + 2 * padding2)
             .append("g")
             .attr("transform", "translate(" + padding2 / 2 + "," + padding2 / 2 + ")");

// create tooltip for the hover 
var tooltip2 = d3.select("body").append("div")   
           .attr("class", "tooltip")               
           .style("opacity", 0.9);

// create titles for plots
var title2 = svg2.append("text")
				 .attr("class", "title")
        		 .attr("x", ((size2 * n2 + 2 * padding2 + margin2) / 2))             
       			 .attr("y", 0 + (margin2 / 2))
       			 .attr("text-anchor", "middle")  
       			 .text("Scatterplot Matrix");


// // create other variables for parallel

// create margins, width, and height
var margin3 = {top: 60, right: 30, bottom: 10, left: 30},
  width3 = 960 - margin3.left - margin3.right,
  height3 = 500 - margin3.top - margin3.bottom;

// create scales
var xScale3 = d3.scale.ordinal()
                .rangePoints([0, width3]);

var yScale3 = {};

// create color scale 
var colorScale3 = d3.scale.ordinal()
                    .range(["#fdc086","#beaed4"]);

// create axis
var Axis3 = d3.svg.axis()
              .orient("left");

// create empty dragging variable 
var dragging3 = {};

// create svg line
var line3 = d3.svg.line();

// create variables
var background3;
var foreground3;

// create svg images
var svg3 = d3.select("svg#parallel")
             .attr("width", width3 + margin3.left + margin3.right)
             .attr("height", height3 + margin3.top + margin3.bottom)
             // .attr("id", "plot")
             // .attr("display", "block")
             .append("g")
             .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

// create tooltip for the hover 
var tooltip3 = d3.select("body").append("div")   
           .attr("class", "tooltip")               
           .style("opacity", 0.9);

// create titles for plots
var title3 = svg3.append("text")
				 .attr("class", "title")
       			 .attr("x", (width3 / 2))             
       			 .attr("y", 0 - (margin3.top / 2))
       			 .attr("text-anchor", "middle")  
       			 .text("Parallel Coordinates");

window.onload = d3.select("input#red").property("checked", true),
                d3.select("input#white").property("checked", true); 

// load data and add into svgs
d3.csv("../dataset/winequality.csv", function(data) {

    var colors = {"white": colorScale1("white"), "red": colorScale1("red")}

    // json of dimensions and adjusted titles
    var cols = {"alcohol": "Alcohol Level", "chlorides": "Chlorides", "citricAcid": "Citric Acid", "density": "Density", "fixedAcidity": 
                "Fixed Acidity", "freeSulfurDioxide": "Free Sulfur Dioxide", "pH": "pH", "residualSugar": "Residual Sugar", "sulphates": 
                "Sulphates", "totalSulfurDioxide": "Total Sulfur Dioxide", "volatileAcidity": "Volatile Acidity"}


    var quality_counter = {}
    for (var i=0; i<data.length; i++) {
        if (data[i].quality in quality_counter) {
            if (data[i].type =="red"){
                quality_counter[data[i].quality].red ++;
            } else {
                quality_counter[data[i].quality].white ++;
            }
        } else {
            if (data[i].type =="red"){
                quality_counter[data[i].quality] = {"red": 1, "white": 0};
            } else {
                quality_counter[data[i].quality] = {"red": 0, "white": 1}; 
        }
    }};

    quality_bar = d3.entries(sorted(quality_counter));

    // var quality_counter2 = {}
    // for (var i=0; i<data.length; i++) {
    //     if (data[i].quality in quality_counter2) {
    //         if (data[i].type =="red"){
    //             quality_counter2[data[i].quality].red ++;
    //         } 
    //     } else {
    //         if (data[i].type =="red"){
    //             quality_counter2[data[i].quality] = {"red": 1};
    //         } 
    // }};

    // quality_bar2 = d3.entries(sorted(quality_counter2));

    // chart 1 generator
  	chart1(quality_bar, colors);

    // create array of all variables we want to see in matrix
    var variables = ["alcohol", "chlorides", "fixedAcidity", "citricAcid", "density"];

  	// chart 2 generator
  	chart2(data, variables, cols, colors);

  	// chart 3 generator
  	chart3(data, cols, colors);


  })

// d3.slider().axis(true).min(0).max(10).step(1);

//// CHART 1 CREATION ////
function chart1(data, colors){

    colorScale1.domain(d3.keys(data[0].value).filter(function(key) { return key; }));

    data.forEach(function(d) {
        var y0 = 0;
        d.types = colorScale1.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d.value[name]}; });
        if(d.types.length===1){ 
            d.total = colorScale1.domain().map(function(name) { return d.value[name] });
        } else { 
            d.total = d.value.red + d.value.white
        };
    });

    xScale1.domain(data.map(function(d) { return d.key; }));
    yScale1.domain([0, d3.max(data, function(d) { return d.total; })]);

        // add x axis and label
    svg1.append("g")
        .attr("class", "x1 axis")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xAxis1)
        .append("text")
        .attr("class", "label1")
        .attr("x", width1/2)
        .attr("y", 35)
        .style("text-anchor", "middle")
        .text("Quality Score");

    // add y axis and label
    svg1.append("g")
        .attr("class", "y1 axis")
        .call(yAxis1)
        .append("text")
        .attr("class", "label1")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin1.left + 10)
        .attr("x", 0 - height1/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Wine Samples");

    var wines = svg1.selectAll(".wines")
                    .data(data)
                    .enter()
                    .append("g")
                    .attr("class", "g")
                    .attr("transform", function(d) { return "translate(" + xScale1(d.key) + ",0)"; });

    wines.selectAll("rect")
         .data(function(d) { return d.types; })
         .enter()
         .append("rect")
         .attr("width", xScale1.rangeBand())
         .attr("y", function(d) { return yScale1(d.y1); })
         .attr("height", function(d) { return yScale1(d.y0) - yScale1(d.y1); })
         .style("fill", function(d) { return colors[d.name]; })
         .style("opacity", 0.7)
         .on("mouseover", function(d) {
              tooltip1.transition()
                  .duration(200)
                      .style("opacity", 1)
              tooltip1.html("<span><b>Wine Type</b>: " + d.name + " </span><br>" +
                            "<span><b>Number of Samples</b>: " + (d.y1-d.y0) + "</span><br>")
                     .style("left", (event.pageX + 15) + "px")     
                     .style("top", (event.pageY - 20) + "px"); 
              d3.select(this).style("opacity", 1); 
            })
         .on("mouseout", function(d){
              tooltip1.transition()
                     .style("opacity", 0);
              d3.select(this).style("opacity", 0.7); 
           });

}	


//// CHART 2 CREATION ////
function chart2(data, variables, cols, colors) {
    // create empty scales that will be updated for each plot
    var xScale2 = {};
    var yScale2 = {};

    // create different x and y scales for each variable
    variables.forEach(function(variable) {
        data.forEach(function(d) { d[variable] = +d[variable]; });
        xScale2[variable] = d3.scale.linear()
                              .domain(d3.extent(data, function(d) { return d[variable]; }))
                              .nice()
                              .range([padding2, size2 - padding2]);
                                        
        yScale2[variable] = d3.scale.linear()
                              .domain(d3.extent(data, function(d) { return d[variable]; }))
                              .nice()
                              .range([size2 - padding2, padding2]);                                  
    }); 

    // create the axes
    var Axis2 = d3.svg.axis()
                      .ticks(4)
                      .tickSize(size2 * n2); 

    // create x axis for each plot
    svg2.selectAll(".x.axis")
        .data(variables)
        .enter()
        .append("g")
        .attr("class", "scatter x axis")
        .attr("transform", function(d, i) { return "translate(" + i * size2 + ",0)"; })
        .each(function(d)  { d3.select(this).call(Axis2.scale(xScale2[d]).orient("bottom")); });

    // create y axis for each plot 
    svg2.selectAll(".y.axis")
        .data(variables)
        .enter()
        .append("g")
        .attr("class", "scatter y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size2 + ")"; })
        .each(function(d) { d3.select(this).call(Axis2.scale(yScale2[d]).orient("right"));  });

    // create cell and plots
    var cell = svg2.selectAll(".cell")
                   .data(cross(variables, variables))
                   .enter()
                   .append("g")
                   .attr("class", "cell")
                   .attr("transform", function(d) { return "translate(" + d.i * size2 + "," + d.j * size2 + ")"; })
                   .each(plot);

    // create titles for the diagonal
    cell.filter(function(d) { return d.i == d.j; }).append("text")
        .attr("x", padding2)
        .attr("y", padding2)
        .attr("dy", ".71em")
        .text(function(d) { return cols[d.x]; });

    // function to create all the scatter plots
    function plot(p) {
      var cell = d3.select(this);

      // create plot frame
      cell.append("rect")
          .attr("class", "frame")
          .attr("opacity", "1")
          .attr("x", padding2 / 2)
          .attr("y", padding2 / 2)
          .attr("width", size2 - padding2)
          .attr("height", size2 - padding2);

      // create points in each frame
      cell.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", function(d) { return d.type; })
          .attr("cx", function(d) { return xScale2[p.x](d[p.x]); })
          .attr("cy", function(d) { return yScale2[p.y](d[p.y]); })
          .attr("r", 1)
          .attr("opacity", 0.5)
          .attr("fill", function(d) { return colors[d.type]; });
    }

    // function to show cross product of all variables
    function cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
        return c;
    }

}


//// CHART 3 CREATION ////
function chart3(data, cols, colors) {

    // empty list of categoricals
    categoricals = [];

    // list of dimensions and create scale for each (excluding all categorical data but state name)
    xScale3.domain(dimensions = d3.keys(data[0]).filter(function(d) {
        if(["quality", "type", "density"].indexOf(d) > -1) return false;
        // if (["quality"].indexOf(d) > -1) { 
        //     categoricals.push(d);
        //     yScaleA[d] = d3.scale.ordinal()
        //                    .domain(data.map(function(p) { return p[d]; }))
        //                    .rangePoints([heightA, 0]);
        // } 
        else { 
            yScale3[d] = d3.scale.linear()
                           .domain(d3.extent(data, function(p) { return +p[d]; }))
                           .nice()
                           .range([height3, 0]);
        }
        return true;
      }));

    // add grey background lines for context
    background3 = svg3.append("g")
                      .attr("class", "background")
                      .selectAll("path")
                      .data(data)
                      .enter()
                      .append("path")
                      .attr("d", path);

    // add foreground lines for focus (colored by region)
    foreground3 = svg3.append("g")
                      .attr("class", "foreground")
                      .selectAll("path")
                      .data(data)
                      .enter()
                      .append("path")
                      .style("stroke", function(d) { return colors[d.type]; })
                      .style("stroke-width", 1.25)
                      .attr("d", path);

    // add group elements for each dimension
    var g = svg3.selectAll(".dimension")
                  .data(dimensions)
                  .enter()
                  .append("g")
                  .attr("class", "dimension")
                  .attr("transform", function(d) { return "translate(" + xScale3(d) + ")"; })
                  .call(d3.behavior.drag()
                  .on("dragstart", function(d) {
                      dragging3[d] = this.__origin__ = xScale3(d);
                      background3.attr("visibility", "hidden");
                  })
                  .on("drag", function(d) {
                      dragging3[d] = Math.min(width3, Math.max(0, this.__origin__ += d3.event.dx));
                      foreground3.attr("d", path);
                      dimensions.sort(function(a, b) { return position(a) - position(b); });
                      xScale3.domain(dimensions);
                      g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                  })
                  .on("dragend", function(d) {
                      delete this.__origin__;
                      delete dragging3[d];
                      transition(d3.select(this)).attr("transform", "translate(" + xScale3(d) + ")");
                      transition(foreground3).attr("d", path);
                      background3.attr("d", path)
                                 .transition()
                                 .delay(500)
                                 .duration(0)
                                 .attr("visibility", null);
                  }));

  // add an axis and title
    g.append("g")
       .attr("class", "axis")
       .each(function(d) { d3.select(this).call(Axis3.scale(yScale3[d])); })
       .append("text")
       .attr("text-anchor", "middle")
       .attr("y", -9)
       .text(function(d) {return cols[d]} );

  // add and store a brush for each axis
    g.append("g")
       .attr("class", "brush")
       .each(function(d) { d3.select(this).call(yScale3[d].brush = d3.svg.brush().y(yScale3[d]).on("brushstart", brushstart).on("brush", brush)); })
       .selectAll("rect")
       .attr("x", -8)
       .attr("width", 16);
}


// function to sort the data
function sorted(obj) {

	// create temp array
	var temp_array = []
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp_array.push(key);
        }
    }

    	temp_array.sort();
    // }

    // create new object sorted
	sort_budget = {};
	for (var i=0; i<temp_array.length; i++) {
    	sort_budget[temp_array[i]] = obj[temp_array[i]];
	}

	return sort_budget;
}

// returns position
function position(d) {
    var v = dragging3[d];
    return v == null ? xScale3(d) : v;
}

// transition funfction
function transition(g) {
    return g.transition().duration(500);
}

// returns the path for a given data point
function path(d) {
    return line3(dimensions.map(function(p) { return [position(p), yScale3[p](d[p])]; }));
}

// when brushing, don’t trigger axis dragging
function brushstart() {
    d3.event.sourceEvent.stopPropagation();
}

// handles a brush event, toggling the display of foreground lines
function brush() {
    var actives = dimensions.filter(function(p) { return !yScale3[p].brush.empty(); });
    var extents = actives.map(function(p) { return yScale3[p].brush.extent(); });

    foreground3.style("display", function(d) {
        return actives.every(function(p, i) {
            // Categorical
            if (["quality"].indexOf(p) > -1) {
                return extents[i][0] <= yScale3[p](d[p]) && yScale3[p](d[p]) <= extents[i][1];
            } else {
                // Numeric
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
              }
        }) ? null : "none";
    });
}

    