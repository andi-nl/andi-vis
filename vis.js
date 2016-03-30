d3.json("data/patientoutput.json", function(patientStats) {


  var margin = {top: 30, right: 50, bottom: 30, left:50};
  var width = 800 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var color = d3.scale.category10();

  // scales
  var minScore = d3.min([d3.min(patientStats, function(d) {
                                  return d.inneredge;
                                }),
                         d3.min(patientStats, function(d) {
                                  return d.univariateT;
                                })
                       ]);

  var maxScore = d3.max([d3.max(patientStats, function(d) {
                                  return d.outeredge;
                                }),
                         d3.max(patientStats, function(d) {
                                  return d.univariateT;
                                })
                        ]);

  // for x need to translate test name to number
  var testnames = patientStats.map(function(t) {
    return t.testnames;
  });
  testnames = _.union(testnames);

  var xScale = d3.scale.linear()
                       .domain([0, testnames.length - 1])
                       .range([0, width])

  var yScale = d3.scale.linear()
                       .domain([minScore, maxScore])
                       .range([height, 0]);

// define lines
var outerLine = d3.svg.line()
  .x(function(d) {return xScale(testnames.indexOf(d['testnames']));})
  .y(function(d) {return yScale(d.outeredge)})

var innerLine = d3.svg.line()
  .x(function(d) {return xScale(testnames.indexOf(d['testnames']));})
  .y(function(d) {return yScale(d.inneredge)})

// define plot
  var svg = d3.select("body")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

  // define axes

  var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("right");
  svg.append("g")
      .attr("class", "axis")
      .call(yAxis);

  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("top")
                    .tickValues(d3.range(testnames.length))
                    .tickFormat(function(t) {
                      return testnames[t];
                    });
  svg.append("g")
     .attr("class", "axis")
     .call(xAxis)
   .selectAll("text")
     .attr("dx", "3em")
     .attr("dy", "-0.3em")
     .attr("transform", "rotate(0)");

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
     .attr("r", 5)
     .style("fill", function(d) { return color(d.id); });

  // add zero line
  svg.append("line")
    .attr({
      x1: xScale(0),
      y1: yScale(0),
      x2: xScale(2),
      y2: yScale(0)
    });

  // add lines
  svg.append("path")
    .attr("class", "line")
    .attr("d", outerLine(patientStats));
  svg.append("path")
    .attr("class", "line")
    .attr("d", innerLine(patientStats));
});
