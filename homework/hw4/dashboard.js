// set all variables for each of the charts
// chart 1 - horizontal bar chart
// chart 2 - scatter plot
// chart 3 - bar chart for budget

// create margins, widths and heights
var margin1 = {top: 60, right: 120, bottom: 50, left: 70},
	width1 = 930 - margin1.left - margin1.right,
	height1 = 300 - margin1.top - margin1.bottom;

var margin2 = {top: 60, right: 20, bottom: 50, left: 50},
	width2 = 532 - margin2.left - margin2.right,
	height2 = 400 - margin2.top - margin2.bottom;

var margin3 = {top: 60, right: 110, bottom: 50, left: 20},
	width3 = 395 - margin3.left - margin3.right,
	height3 = 400 - margin3.top - margin3.bottom;


// create x scales (linear)
var xScale1 = d3.scale.linear()
                .range([width1, 0]);

var xScale2 = d3.scale.linear()
    			.range([0, width2]);

var xScale3 = d3.scale.ordinal()
    			.rangeRoundBands([0, width3], .1);


// create y scales (ordinal)
var yScale1 = d3.scale.ordinal()
             	.rangeRoundBands([0, height1], 0.1);

var yScale2 = d3.scale.linear()
    			.range([height2, 0]);

var yScale3 = d3.scale.linear()
    			.rangeRound([height3, 0]);


// create color scales (ordinal)
var color1 = d3.scale.ordinal()
               .range(colorbrewer.Dark2[4]);

var color2 = d3.scale.ordinal()
               .range(colorbrewer.Dark2[4]);

var color3 = d3.scale.ordinal()
    		   .range(colorbrewer.Dark2[4]);  


// create axes based on scales
var xAxis1 = d3.svg.axis()
               .scale(xScale1)
               .orient("bottom");

var xAxis2 = d3.svg.axis()
    		   .scale(xScale2)
    		   .orient("bottom");

var xAxis3 = d3.svg.axis()
    		   .scale(xScale3)
    		   .orient("bottom");

var yAxis1 = d3.svg.axis()
               .scale(yScale1)
               .orient("left");

var yAxis2 = d3.svg.axis()
    		   .scale(yScale2)
    		   .orient("left");

var yAxis3 = d3.svg.axis()
    		   .scale(yScale3)
    		   .orient("right");


// create svg images
var svg1 = d3.select("svg#mpaa")
    		 .attr("width", width1 + margin1.left + margin1.right)
   			 .attr("height", height1 + margin1.top + margin1.bottom)
    	     .append("g")
  		     .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

var svg2 = d3.select("svg#scatter")
    		 .attr("width", width2 + margin2.left + margin2.right)
   			 .attr("height", height2 + margin2.top + margin2.bottom)
   			 .append("g")
   			 .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


var svg3 = d3.select("svg#budget")
    		 .attr("width", width3 + margin3.left + margin3.right)
   			 .attr("height", height3 + margin3.top + margin3.bottom)
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
   			     .text("Number of Movies by MPAA Rating");

var title2 = svg2.append("text")
				 .attr("class", "title")
        		 .attr("x", (width2 / 2))             
       			 .attr("y", 0 - (margin2.top / 2))
       			 .attr("text-anchor", "middle")  
       			 .text("Rating vs. Length of Movie (in minutes)");

var title3 = svg3.append("text")
				 .attr("class", "title")
       			 .attr("x", (width3 / 2))             
       			 .attr("y", 0 - (margin3.top / 2))
       			 .attr("text-anchor", "middle")  
       			 .text("Average Budget by Decade");

// create format for budget
var format = d3.format("0,000,000");


// load data and add into svgs
d3.csv("hw4/movies.csv", function(data) {

	// make all numeric value numeric
	// add yearranges and color
	data.forEach(function(d) {
	    d.budget = +d.budget;
	    d.length = +d.length;
	    d.rating = +d.rating;
	    d.votes = +d.votes;
	    d.yearrange = d.year.substring(0,3)+'0s';
	    d.year = +d.year
	    d.color = color2(d.mpaa);
	})

	// create new object with counts for chart 1 
	var mpaa_counter = {}
	for (var i=0; i<data.length; i++) {
        if (data[i].mpaa in mpaa_counter) {
        	mpaa_counter[data[i].mpaa].value++;
        }
        else {
            mpaa_counter[data[i].mpaa]={value: 1, color: data[i].color};
        }
    };

    // sort and create an object of object
    var mpaa_freq = d3.entries(sorted(mpaa_counter));

    // chart 1 generator
	chart1(mpaa_freq);
	create_legend(mpaa_freq);

	// chart 2 generator
	chart2(data);

	// create new object that sums all the budget by decades for chart 3
	var budget = {}
	for (var i=0; i<data.length; i++) {
		if (data[i].yearrange in budget) {
			budget[data[i].yearrange].budget += data[i].budget;
			budget[data[i].yearrange].count ++;
		}
		else {
			budget[data[i].yearrange]={count: 1, budget: data[i].budget,
				color: data[i].color};
		}
	};

	// sort and make an object of objects
	var budget = d3.entries(sorted(budget));

	// calculate the average for each decade
	budget.forEach(function(d) {
		d.average = d.value.budget/d.value.count;
	});

	// chart 3 generator
	chart3(budget);


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
function chart3(data) {

	// create domains for x and y scale
	xScale3.domain(data.map(function(d) { return d.key; }));
	yScale3.domain([0, d3.max(data, function(d) { return d.average; })]);

	// add x axis and label
	svg3.append("g")
        .attr("class", "x3 axis")
        .attr("transform", "translate(0," + height3 + ")")
        .call(xAxis3)
    	.append("text")
        .attr("class", "label3")
        .attr("x", width3/2)
        .attr("y", 35)
        .style("text-anchor", "middle")
        .text("Decades");

    // add y axis and label
  	svg3.append("g")
        .attr("class", "y3 axis")
        .attr("transform", "translate(" + width3 + ",0)")
        .call(yAxis3)
    	.append("text")
        .attr("class", "label3")
        .attr("transform", "rotate(-90)")
        .attr("y", margin3.right - 25)
        .attr("x", 0 - height3/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average Budget")

    // add bars and mouseover 
  	svg3.selectAll(".bar")
      	.data(data)
    	.enter()
    	.append("rect")
      	.attr("class", "bar")
      	.attr("x", function(d) { return xScale3(d.key); })
      	.attr("width", xScale3.rangeBand())
      	.attr("y", function(d) { return yScale3(d.average); })
      	.attr("height", function(d) { return height3 - yScale3(d.average); })
      	.attr("fill", "#377eb8")
      	.on("mouseover", function(d) {
            tooltip3.transition()
            		.duration(200)
                    .style("opacity", 1)
            tooltip3.html("<span><b>Decade</b>: " + d.key + "</span><br>" +
            			  "<span><b>Average Budget</b>: $" + format(Math.round(d.average)) + "</span><br>")
                    .style("left", (event.pageX + 15) + "px")     
                    .style("top", (event.pageY - 20) + "px"); 
            d3.select(this).style("opacity", 0.5); 
         })
        .on("mouseout", function(d){
            tooltip3.transition()
                    .style("opacity", 0);
            d3.select(this).style("opacity", 1); 
         });

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
