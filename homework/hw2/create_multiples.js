
d3.csv("state.csv", function(data) {
    var marginB = {top: 30, right: 20, bottom: 30, left: 30},
        widthB = 400 - marginB.left - marginB.right,
        heightB = 250 - marginB.top - marginB.bottom;

    var xScaleB = d3.scale.ordinal()
                   .rangeRoundBands([0, widthB], 0.1);

    var yScaleB = d3.scale.linear()
                   .range([heightB, 0]);

    var xAxisB = d3.svg.axis()
                  .scale(xScaleB)
                  .orient("bottom");

    var yAxisB = d3.svg.axis()
                  .scale(yScaleB)
                  .orient("left")
                  .ticks(5);

    var colorScaleB = d3.scale.ordinal()
                       .range(colorbrewer.Set2[4]);

    var states = d3.nest()
                   .key(function(d){ return d.region; })
                   .entries(data);


    states.forEach(function(s) {
        s.LifeExp = d3.mean(s.values, function(d) { return d.life_expectancy; });
        s.Murder = d3.mean(s.values, function(d){ return d.murders });
        s.Inc = d3.mean(s.values, function(d){ return d.income });
        s.Popul = d3.mean(s.values, function(d){ return d.population });
        s.HSGrad = d3.mean(s.values, function(d){ return d.hs_grad });
        s.Frost = d3.mean(s.values, function(d){ return d.days_frost });
        s.Land = d3.mean(s.values, function(d){ return d.land_area });
        s.Ill = d3.mean(s.values, function(d){ return d.illiteracy });
    });
    console.log(states)

    console.log(states.map(function(d){ return d.key;}))


    xScaleB.domain(states.map(function(d){ return d.key; }));
    yScaleB.domain([0, d3.max(states.map(function(d) { return d.LifeExp}))]);

        var svgB = d3.select("p")
                .append("svg")
                .attr("width", widthB + marginB.left + marginB.right)
                .attr("height", heightB + marginB.top + marginB.bottom)
                .append("g")
                .attr("transform", "translate(" + marginB.left + "," + marginB.top + ")");

    svgB.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightB + ")")
        .call(xAxisB);

    svgB.append("g")
        .attr("class", "y axis")
        .call(yAxisB);

        //transform the data
    // var dataT = d3.entries(d3.layout.stack()(["life_expectancy", "murders", "income", "population", "hs_grad", "days_frost", "land_area", "illiteracy"].map(function(metric) {
    //     return data.map(function(d) {return {x: d.region, y: d[metric]};});})));



    // console.log(dataT)
    // xScaleB.domain(dataT[0].value.map(function(d) { return d.x; }));

})