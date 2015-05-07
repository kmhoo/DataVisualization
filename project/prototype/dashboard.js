// set all variables for each of the charts
// chart 1 - stacked bar chart
// chart 2 - scatter plot matrix
// chart 3 - parallel coordinates

// create margins, widths and heights
var margin1 = {top: 60, right: 30, bottom: 50, left: 30},
	width1 = 395 - margin1.left - margin1.right,
	height1 = 400 - margin1.top - margin1.bottom;

var margin2 = {top: 60, right: 30, bottom: 50, left: 30},
	width2 = 532 - margin2.left - margin2.right,
	height2 = 400 - margin2.top - margin2.bottom;

var margin3 = {top: 60, right: 30, bottom: 10, left: 30},
	width3 = 930 - margin3.left - margin3.right,
	height3 = 400 - margin3.top - margin3.bottom;


// create x scales (linear)
var xScale1 = d3.scale.linear()
                .range([width1, 0]);

var xScale2 = d3.scale.linear()
    			.range([0, width2]);

var xScale3 = d3.scale.ordinal()
    			      .rangePoints([0, width3], 1);


// create y scales (ordinal)
var yScale1 = d3.scale.ordinal()
             	.rangeRoundBands([0, height1], 0.1);

var yScale2 = d3.scale.linear()
    			      .range([height2, 0]);

var yScale3 = {};


// create color scales (ordinal)
var colorScale = d3.scale.ordinal()
                   .range(["#fdc086","#beaed4"]);

// create axes based on scales
var xAxis1 = d3.svg.axis()
               .scale(xScale1)
               .orient("bottom");

var xAxis2 = d3.svg.axis()
    		       .scale(xScale2)
    		       .orient("bottom");

var yAxis1 = d3.svg.axis()
               .scale(yScale1)
               .orient("left");

var yAxis2 = d3.svg.axis()
    		       .scale(yScale2)
    		       .orient("left");

// create axis
var Axis3 = d3.svg.axis()
              .orient("left");

// // create other variables for parallel

// create empty dragging variable 
var dragging3 = {};

// create svg line
var line3 = d3.svg.line();

// create variables
var background3;
var foreground3;

// create svg images
var svg1 = d3.select("svg#bar")
    		 .attr("width", width1 + margin1.left + margin1.right)
   			 .attr("height", height1 + margin1.top + margin1.bottom)
    	     .append("g")
  		     .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

var svg2 = d3.select("svg#scatter")
    		 .attr("width", width2 + margin2.left + margin2.right)
   			 .attr("height", height2 + margin2.top + margin2.bottom)
   			 .append("g")
   			 .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


var svg3 = d3.select("svg#parallel")
    		     .attr("width", width3 + margin3.left + margin3.right)
   			     .attr("height", height3 + margin3.top + margin3.bottom)
             // .attr("id", "plot")
             // .attr("display", "block")
   			     .append("g")
   			     .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");


// create tooltip for the hover 
var tooltip1 = d3.select("body").append("div")   
    			 .attr("class", "tooltip")               
   				 .style("opacity", 0.9);

var tooltip2 = d3.select("body").append("div")   
     			 .attr("class", "tooltip")               
    			 .style("opacity", 0.9);

var tooltip3 = d3.select("body").append("div")   
     			 .attr("class", "tooltip")               
    			 .style("opacity", 0.9);


// create titles for plots
var title1 = svg1.append("text")
				 .attr("class", "title")
    		     .attr("x", (width1 / 2))             
   			     .attr("y", 0 - (margin1.top / 2))
   			     .attr("text-anchor", "middle")  
   			     .text("Distribution of Wine Quality by Type");

var title2 = svg2.append("text")
				 .attr("class", "title")
        		 .attr("x", (width2 / 2))             
       			 .attr("y", 0 - (margin2.top / 2))
       			 .attr("text-anchor", "middle")  
       			 .text("Scatterplot Matrix");

var title3 = svg3.append("text")
				 .attr("class", "title")
       			 .attr("x", (width3 / 2))             
       			 .attr("y", 0 - (margin3.top / 2))
       			 .attr("text-anchor", "middle")  
       			 .text("Parallel Coordinates");

// create format for budget
var format = d3.format("0,000,000");


// load data and add into svgs
d3.csv("../dataset/winequality.csv", function(data) {

    // json of dimensions and adjusted titles
    var cols = {"quality": "Quality Score", "alcohol": "Alcohol Level", "chlorides": "Chlorides", "citricAcid": "Citric Acis", 
                "density": "Density", "fixedAcidity": "Fixed Acidity", "freeSulfurDioxide": "Free Sulfur \nDioxide", "pH": "pH",
                "residualSugar": "Residual Sugar", "sulphates": "Sulphates", "totalSulfurDioxide": "Total Sulfur Dioxide", 
                "volatileAcidity": "Volatile Acidity", "type": "Type"}

   //  // chart 1 generator
  	// chart1(data);

  	// // chart 2 generator
  	// chart2(data);

  	// chart 3 generator
  	chart3(data, cols);


  })

//// CHART 1 CREATION ////
function chart1(data){

	// create domains for x and y scale
	xScale1.domain([1100, 0]);
	yScale1.domain(data.map(function(d) { return d.key; }));

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
        .text("Number of Movies");

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
        .text("MPAA Rating");

    // create bars
    var bars = svg1.append("g")
                   .attr("class", "bars")
				   .selectAll(".bar")
        		   .data(data)
    		       .enter()
 		           .append("g")
  			       .attr("class", function(d) { return "bar " + d.key; });

    bars.append("rect")
    	.attr("class", function(d) { return d.key; })
    	.attr("x", 0)
        .attr("width", function(d) { return xScale1(d.value.value); })
        .attr("y", function(d) { return yScale1(d.key); })
        .attr("height", yScale1.rangeBand())
        .attr("fill", function(d) { return d.value.color})
        .style("opacity", 0.7)
    	.on("mouseover", function(d) {
            tooltip1.transition()
            		.duration(200)
                    .style("opacity", 1)
            tooltip1.html("<span><b>MPAA Rating</b>: " + d.key + " </span><br>" +
                          "<span><b>Number of Movies</b>: " + d.value.value + "</span><br>")
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
function chart2(data) {

	// create domains for x and y scale
	xScale2.domain(d3.extent(data, function(d) { return d.length; })).nice();
  	yScale2.domain(d3.extent(data, function(d) { return d.rating; })).nice();

  	// add x axis and label
	svg2.append("g")
        .attr("class", "x2 axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2)
    	.append("text")
        .attr("class", "label2")
        .attr("x", width2/2)
        .attr("y", 35)
        .style("text-anchor", "middle")
        .text("Length of Movie (in minutes)");

    // add y axis and label
  	svg2.append("g")
        .attr("class", "y2 axis")
        .call(yAxis2)
	    .append("text")
        .attr("class", "label2")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin2.left + 15)
        .attr("x", 0 - height2/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Rating of Movie")

    // add dots and mouseovers 
    svg2.selectAll(".dot")
      	.data(data)
    	.enter()
    	.append("circle")
      	.attr("class", "dot")
   	    .attr("r", 2)
        .attr("cx", function(d) { return xScale2(d.length); })
	    .attr("cy", function(d) { return yScale2(d.rating); })
        .style("fill", function(d) { return color2(d.mpaa); })
        .style("opacity", 0.5)
        .on("mouseover", function(d) {
            tooltip2.transition()
            		.duration(200)
                    .style("opacity", 1)
            tooltip2.html("<span><b>Movie Title</b>: " + d.title +"</span><br>" +
            			  "<span><b>MPAA Rating</b>: " + d.mpaa +" </span><br>" +
                          "<span><b>Length of Movie</b>: " + d.length + " mins. </span><br>" +
                          "<span><b>Rating</b>: " + d.rating + "</span><br>")
                   .style("left", (event.pageX + 15) + "px")     
                   .style("top", (event.pageY - 20) + "px"); 
            d3.select(this).style("opacity", 1)
            		 	   .attr("r", 5); 
          })
        .on("mouseout", function(d){
            tooltip2.transition()
                   .style("opacity", 0);
            d3.select(this).style("opacity", 0.5)
            			   .attr("r", 2); });

}


//// CHART 3 CREATION ////
function chart3(data, cols) {

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
                      .style("stroke", function(d) { return colorScale(d.type); })
                      .style("stroke-width", 1.25)
                      .attr("d", path);

    // add group elements for each dimension
    var grp = svg3.selectAll(".dimension")
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
                      grp.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
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
    grp.append("g")
       .attr("class", "axis")
       .each(function(d) { d3.select(this).call(Axis3.scale(yScale3[d])); })
       .append("text")
       .attr("text-anchor", "middle")
       .attr("y", -9)
       .text(function(d) {return cols[d]} );

  // add and store a brush for each axis
    grp.append("g")
       .attr("class", "brush")
       .each(function(d) { d3.select(this).call(yScale3[d].brush = d3.svg.brush().y(yScale3[d]).on("brushstart", brushstart).on("brush", brush)); })
       .selectAll("rect")
       .attr("x", -8)
       .attr("width", 16);
}


// function to create legend in chart 1
function create_legend(data){

    // create legend for mpaa rating 
	var legend = svg1.selectAll(".legend")
      				 .data(data)
    				 .enter()
    				 .append("g")
      				 .attr("class", "legend")
      				 .style("border", "#000")
      				 .attr('transform', function(d, i) {  return "translate(0," + i * 25 + ")"; });

  	legend.append("rect")
          .attr("x", width1 + 20)
      	  .attr("width", 18)
      	  .attr("height", 18)
          .style("fill", function(d){ return d.value.color })
          .style("opacity", 0.7)
          .on("click", function(d) {
          	d3.select(this).style("opacity", 1);
          	console.log(d.key)
          	console.log(d3.select(this).selected());
          });

  	legend.append("text")
          .attr("x", width1 + 40)
          .attr("y", 13)
          .text(function(d) { return d.key; });
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

    // sort the keys 
    if (temp_array.length==4) {
        temp_array.sort(function(a,b) {
        	var a_value = obj[a].value;
            var b_value = obj[b].value;
          	return ((a_value < b_value) ? 1 : ((a_value > b_value) ? -1 : 0));
        });
    }
    else {
    	temp_array.sort();
    }

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
