// functions to return values for each variable
function x(d) { return d.murders; }
function y(d) { return d.life_expectancy; }
function radius(d) { return d.population; }
function color(d) { return d.region; }
function key(d) { return d.abb; }

// create margins for svg
var margin = {top: 20, right: 50, bottom: 40, left: 50},
    width = 900 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// create scale for x axis - murders
var xScale = d3.scale.linear()
               .domain([0, 18])
               .range([0, width]);

// create scale for y axis - life expectancy
var yScale = d3.scale.linear()
               .domain([65, 75])
               .range([height, 0]);

// create scale for radius of bubbles
var radiusScale = d3.scale.sqrt()
                    .domain([0, 25000])
                    .range([0, 40]);

// create scale for the colors using colorbrewer
var colorScale = d3.scale.ordinal()
                   .range(colorbrewer.Set2[4]);

// create x axis
var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");

// create y axis
var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");

// create tool tip
var format = d3.format("0,000");
var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10,0])
            .html(function(d){
              return "<strong> State: </strong> <span>" + d.name + "</span><br>"+
                     "<strong> Population: </strong> <span>" + format(d.population) + "</span><br>";});

// create svg for c level functionality
var svg = d3.select("#chartC")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// call the tooltip to be used
svg.call(tip);

// add x axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// add x axis label
svg.append("text")
    .attr("x", width/2)
    .attr("y",  height + margin.bottom)
    .style("text-anchor", "middle")
    .text("Murders");

// add y axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// add y axis label
svg.append("text")
    .attr("transform", "rotate(-90) translate(-10, 0)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height/2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Life Expectancy");

// load the data and add into svg
d3.json("statex77.json", function(data) {

    // add color into object 
    data.forEach(function(d){ d.color = colorScale(d.region) })

    // create bubbles using x, y and radius amounts
    var dot = svg.append("g")
                 .attr("class", "dots")
                 .selectAll(".dot")
                 .data(data)
                 .enter()
                 .append("circle")
                 .attr("class", "dot")
                 .on("mouseover", tip.show)
                 .on("mouseout", tip.hide)
                 .style("fill", function(d) { return colorScale(color(d)); })
                 .call(position)
                 .sort(order);

    // create objects with region and color
    var colors = d3.entries(create_colors(data))

    // create a legend for color and region
    var legend = svg.selectAll('.legend')
                    .data(colors)
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', function(d, i) { 
                        return 'translate(' + (width - 100) + ',' + (i * 25) + ')';
                    });

    // fill circles with colors
    legend.append('rect')
          .attr('width', 20)
          .attr('height', 20)
          .style('fill', function(d) { return d.value; })
          .style('opacity', .95)
          .style('stroke', 'black');

    // add the region name
    legend.append('text')
          .attr('x', 25)
          .attr('y', 15)
          .text(function(d) { return d.key; });

    // function to return the position of the circle
    function position(dot) {
    dot.attr("cx", function(d) { return xScale(x(d)); })
       .attr("cy", function(d) { return yScale(y(d)); })
       .attr("r", function(d) { return radiusScale(radius(d)); });
    }

    // function to put smaller circles on top of each other
    function order(a, b) {
        return b.population - a.population;
    }

    // create object of colors and regions
    function create_colors(data) {
        colors = {}
        for  (var i = 0; i < data.length; i++) {
            colors[data[i].region] = data[i].color;
        };
        return colors
    }
})

