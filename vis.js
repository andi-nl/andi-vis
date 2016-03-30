d3.json("data/patientoutput.json", function(patientStats) {

  var w = 500;
  var h = 500;
  var padding = 20;

  // make scale maping for positioning tests on x axis
  var testnames = patientStats.map(function(t) {
    return t.testnames;
  });
  testnames = _.union(testnames);
  var testUnit = Math.floor(w / testnames.length);
  var testScale = []
  for (var i = 0; i <= testnames.length; i++) {
    testScale.push(i * testUnit + 25)
  }
  var testMap = {};
  for (var i = 0; i < testnames.length; i++) {
    testMap[testnames[i]] = testScale[i];
  }

  // make y axis scale for test scores
  var yScale = d3.scale.linear()
                               .domain([-10, 10])
                               .range([padding, w - padding]);



// define plot
  var svg = d3.select("body")
          .append("svg")
          .attr("width", w)
          .attr("height", h);

  // define axes
  var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("right");
  svg.append("g")
     .call(yAxis);

// add 'scatterplot' elements
  svg.selectAll("circle")
     .data(patientStats)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
       return testMap[d['testnames']];
     })
     .attr("cy", function(d) {
       return yScale(d['univariateT']);
     })
     .attr("r", 5);

});
