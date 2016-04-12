$(document).ready(function() {

  d3.json("data/patientoutput.json", function(patientStats) {

    var margin = {
      top: 30,
      right: 100,
      bottom: 30,
      left: 50
    };
    var width = 800 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var color = d3.scale.category10();

    // scales

    var scalePadding = 0.5;
    var minScore = d3.min([d3.min(patientStats, function(d) {
        return d.inneredge;
      }),
      d3.min(patientStats, function(d) {
        return d.univariateT;
      })
    ]);
    minScore = minScore - scalePadding;
    var maxScore = d3.max([d3.max(patientStats, function(d) {
        return d.outeredge;
      }),
      d3.max(patientStats, function(d) {
        return d.univariateT;
      })
    ]);
    maxScore = maxScore + scalePadding;

    // for x need to translate test name to number
    var testnames = patientStats.map(function(t) {
      return t.plotname;
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
      .x(function(d) {
        return xScale(testnames.indexOf(d['plotname']));
      })
      .y(function(d) {
        return yScale(d.outeredge)
      })

    var innerLine = d3.svg.line()
      .x(function(d) {
        return xScale(testnames.indexOf(d['plotname']));
      })
      .y(function(d) {
        return yScale(d.inneredge)
      })

    // define plot
    var linesGraph = d3.select("#lines-graph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // define axes

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("right");
    linesGraph.append("g")
      .attr("class", "axis")
      .call(yAxis);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("top")
      .tickValues(d3.range(testnames.length))
      .tickFormat(function(t) {
        return testnames[t];
      });
    linesGraph.append("g")
      .attr("class", "axis")
      .call(xAxis)
      .selectAll("text")
      .attr("dx", "3em")
      .attr("dy", "-0.3em")
      .attr("transform", "rotate(0)");

    // add 'scatterplot' elements
    linesGraph.selectAll("circle")
      .data(patientStats)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return xScale(testnames.indexOf(d['plotname']));
      })
      .attr("cy", function(d) {
        return yScale(d['univariateT']);
      })
      .attr("r", 5)
      .style("fill", function(d) {
        return color(d.id);
      });

    // add legend for patient
    legendSpace = width / patientStats.length
    patientStats.forEach(function(d, i) {
      console.log(d.tails);
      linesGraph.append("text")
        .attr("x", width + margin.right / 2)
        .attr("y", legendSpace - i * (legendSpace / 2))
        .style("fill", color(d.id))
        .text(d.id);
    });

    // add zero line
    linesGraph.append("line")
      .attr({
        x1: xScale(0),
        y1: yScale(0),
        x2: xScale(testnames.length - 1),
        y2: yScale(0)
      });

    // add lines
    linesGraph.append("path")
      .attr("class", "line")
      .attr("d", outerLine(patientStats));
    linesGraph.append("path")
      .attr("class", "line")
      .attr("d", innerLine(patientStats));


    // utomatically make columns object based on patientStats
    var colNames = Object.keys(patientStats[0]);
    var aaColumns = colNames.map(function(el) {
      return {
        "mDataProp": el
      }
    });

    // add table
    $("#table").dataTable({
      "aaData": patientStats,
      "aoColumns": aaColumns
    });
  });
});
