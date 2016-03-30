d3.json("data/patientoutput.json", function(patientStats) {

  var w = 400;
  var h = 400;

  var svg = d3.select("body")
          .append("svg")
          .attr("width", w)
          .attr("height", h);

  svg.selectAll("circle")
     .data(patientStats)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
       return d['univariateT'] * 10;
     })
     .attr("cy", function(d) {
       return d['multivariateT'] * 10;
     })
     .attr("r", 5);

});
