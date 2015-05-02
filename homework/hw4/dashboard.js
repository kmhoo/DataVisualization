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


// create tooltip for the hover 
var tooltip1 = d3.select("body").append("div")   
    			 .attr("class", "tooltip1")               
   				 .style("opacity", 0.9);

var tooltip2 = d3.select("body").append("div")   
     			 .attr("class", "tooltip2")               
    			 .style("opacity", 0.9);

var tooltip3 = d3.select("body").append("div")   
     			 .attr("class", "tooltip3")               
    			 .style("opacity", 0.9);


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


	//// CHART 1 CREATION ////


	var mpaa_counter = {}
	for (var i=0; i<data.length; i++) {

        if (data[i].mpaa in mpaa_counter) {
            mpaa_counter[data[i].mpaa].value++;
        }
        else {
            mpaa_counter[data[i].mpaa]={value: 1, color: data[i].color};
        }
    };

    var mpaa_freq = d3.entries(sorted(mpaa_counter));

	//chart 1
	xScale1.domain([1100, 0]);
	yScale1.domain(mpaa_freq.map(function(d) { return d.key; }));

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
      .text("MPAA Rating")

  svg1.selectAll(".bar")
      .data(mpaa_freq)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("width", function(d) { return xScale1(d.value.value); })
      .attr("y", function(d) { return yScale1(d.key); })
      .attr("height", yScale1.rangeBand())
      .attr("fill", function(d) { return d.value.color})
      .style("opacity", 0.7);

var legend = svg1.selectAll(".legend")
      .data(mpaa_freq)
    .enter().append("g")
      .attr("class", "legend")
      .style("border", "#000")
      .attr('transform', function(d, i) {  return "translate(0," + i * 25 + ")"; });

  legend.append("rect")
      .attr("x", width1 + 20)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d){ return d.value.color })
      .style("opacity", 0.7);

  legend.append("text")
      .attr("x", width1 + 40)
      .attr("y", 13)
      .text(function(d) { return d.key; });

	//
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


	var budget = d3.entries(sorted(budget));

	budget.forEach(function(d) {
		d.average = d.value.budget/d.value.count;
	});

	xScale3.domain(budget.map(function(d) { return d.key; }));
	yScale3.domain([0, d3.max(budget, function(d) { return d.average; })]);


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

  svg3.selectAll(".bar")
      .data(budget)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale3(d.key); })
      .attr("width", xScale3.rangeBand())
      .attr("y", function(d) { return yScale3(d.average); })
      .attr("height", function(d) { return height3 - yScale3(d.average); })
      .attr("fill", "#377eb8");



	//chart 2
	xScale2.domain(d3.extent(data, function(d) { return d.length; })).nice();
  	yScale2.domain(d3.extent(data, function(d) { return d.rating; })).nice();

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


  svg2.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 2)
      .attr("cx", function(d) { return xScale2(d.length); })
      .attr("cy", function(d) { return yScale2(d.rating); })
      .style("fill", function(d) { return color2(d.mpaa); })
      .style("opacity", 0.5);

})

    function sorted(obj) {
	var temp_array = []
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                temp_array.push(key);
            }
        }
        if (temp_array.length==4) {
            temp_array.sort(function(a,b) {
              var a_value = obj[a].value;
              var b_value = obj[b].value;
              return ((a_value < b_value) ? 1 : ((a_value > b_value) ? -1 : 0));
            });
        }
        else{
        	temp_array.sort();
        }

    sort_budget = {};
    for (var i=0; i<temp_array.length; i++) {
        sort_budget[temp_array[i]] = obj[temp_array[i]];
    }

    return sort_budget;
}