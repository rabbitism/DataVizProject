function drawEvents(data){
    console.log("Event");
    var svg = d3.selectAll("#events").select("svg").attr("width",900).attr("height",600);
    var     margin = {top: 80, right: 80, bottom: 80, left: 80},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
    .curve(d3.curveLinear)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

    var cities = data.columns.slice(2).map(function(id) {
        return {
          id: id,
          values: data.map(function(d) {
            return {date: d.date, temperature: d[id]};
          })
        };
      });

      x.domain([1896,2020]);

  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
  ]);

  z.domain(cities.map(function(c) { return c.id; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y));

  g.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .text("Count of Events and Nations Every Year");

  var city = g.selectAll(".city")
    .data(cities)
    .enter().append("g")
      .attr("class", "city");
    

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) {return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });


  city.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 0)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });

}

function type(d, _, columns) {
    d.date = d.Year;
    d.Season = d.Season;
    for (var i = 2, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
  }
