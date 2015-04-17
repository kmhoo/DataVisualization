d3.csv("state.csv", function(data) {
    var marginA = {top: 30, right: 100, bottom: 10, left: 10},
        widthA = 1000 - marginA.left - marginA.right,
        heightA = 500 - marginA.top - marginA.bottom;

    var xScaleA = d3.scale.ordinal()
    				.rangePoints([0, widthA], 1);

    var yScaleA = {};

    var dragging = {};

    var line = d3.svg.line();
    
    var axis = d3.svg.axis()
    			 .orient("left");

    var background;

    var foreground;

    var svgA = d3.select("p")
                 .append("svg")
                 .attr("width", widthA + marginA.left + marginA.right)
                 .attr("height", heightA + marginA.top + marginA.bottom)
                 .append("g")
                 .attr("transform", "translate(" + marginA.left + "," + marginA.top + ")");

  	xScaleA.domain(dimensions = d3.keys(data[0]).filter(function(d) {
  		return d != "name" && d != "abb" && d != "region" && d != "division" &&
  		(y[d] = d3.scale.linear()
  				  .domain(d3.extent(data, function(p) { return +p[d]; }))
        		  .range([heightA, 0]));
  	}));

  // Add grey background lines for context.
	background = svgA.append("g")
			  		 .attr("class", "background")
					 .selectAll("path")
					 .data(data)
					 .enter()
					 .append("path")
					 .attr("d", path);

	// Add blue foreground lines for focus.
	foreground = svgA.append("g")
					 .attr("class", "foreground")
					 .selectAll("path")
					 .data(data)
					 .enter()
					 .append("path")
					 .attr("d", path);

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + xScaleA(d) + ")"; })
      .call(d3.behavior.drag()
        .on("dragstart", function(d) {
          dragging[d] = this.__origin__ = xScaleA(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(widthA, Math.max(0, this.__origin__ += d3.event.dx));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          xScaleA.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete this.__origin__;
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + xScaleA(d) + ")");
          transition(foreground)
              .attr("d", path);
          background
              .attr("d", path)
              .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(yScaleA[d])); })
    .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(String);

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) { d3.select(this).call(yScaleA[d].brush = d3.svg.brush().y(yScaleA[d]).on("brushstart", brushstart).on("brush", brush)); })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

function position(d) {
	var v = dragging[d];
	return v == null ? x(d) : v;
}

function transition(g) {
	return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
	return line(dimensions.map(function(p) { return [position(p), yScaleA[p](d[p])]; }));
}

// When brushing, don’t trigger axis dragging.
function brushstart() {
	d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
	var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
	  	extents = actives.map(function(p) { return y[p].brush.extent(); });
	foreground.style("display", function(d) {
		return actives.every(function(p, i) {
	  		return extents[i][0] <= d[p] && d[p] <= extents[i][1];
	}) ? null : "none";
	})};

})