d3.json("data/patientoutput.json", function(patientStats) {

  var w = 500;
  var h = 500;
  var padding = 20;

  // scales

  // for x need to translate test name to number
  var testnames = patientStats.map(function(t) {
    return t.testnames;
  });
  testnames = _.union(testnames);

  var xScale = d3.scale.linear()
                       .domain([0, testnames.length - 1])
                       .range([padding, w - padding])

  var yScale = d3.scale.linear()
                       .domain([-5, 5])
                       .range([h - padding, padding]);



// define plot
  var svg = d3.select("body")
          .append("svg")
          .attr("width", w)
          .attr("height", h);

  // define axes
  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickValues(d3.range(testnames.length))
                    .tickFormat(function(t) {
                      return testnames[t];
                    });
  svg.append("g")
     .attr("class", "axis")
     .call(xAxis)
   .selectAll("text")
     .attr("dx", "3em")
     .attr("dy", "3em")
     .attr("transform", "rotate(45)");


  var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("right");
  svg.append("g")
     .attr("class", "axis")
     .call(yAxis);

// add 'scatterplot' elements
  svg.selectAll("circle")
     .data(patientStats)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
       return xScale(testnames.indexOf(d['testnames']));
     })
     .attr("cy", function(d) {
       return yScale(d['univariateT']);
     })
     .attr("r", 5);

});
