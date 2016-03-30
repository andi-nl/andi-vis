d3.json("data/patientoutput.json", function(patientStats) {


  var margin = {top: 30, right: 30, bottom: 30, left:30};
  var width = 500 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
  // scales

  // for x need to translate test name to number
  var testnames = patientStats.map(function(t) {
    return t.testnames;
  });
  testnames = _.union(testnames);

  var xScale = d3.scale.linear()
                       .domain([0, testnames.length - 1])
                       .range([0, width])

  var yScale = d3.scale.linear()
                       .domain([-5, 5])
                       .range([height, 0]);



// define plot
  var svg = d3.select("body")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

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

  // add zero line
  svg.append("line")
    .attr({
      x1: xScale(0),
      y1: yScale(0),
      x2: xScale(3),
      y2: yScale(0)
    })
    .style({
      stroke: "#000000"
    })

  // add edges
  svg.selectAll("line")
    .data()
});
