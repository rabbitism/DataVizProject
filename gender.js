function drawPopulation(error,data){
    var svg = d3.select("#population").select("svg");
    var margin = {top: 20, right: 20, bottom: 80, left: 80};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height-100, 0]);

var y1 = d3.scaleLinear()
    .rangeRound([height-85,height]);

var z = d3.scaleOrdinal()
    .range(["#3d84a8", "#ff2e63"]);

    console.log(data);
  if (error) throw error;

  var keys = data.columns.slice(2,4);

  var tooltip = d3.select("#population")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("background", "#a8d8ea")
  .style("padding","4px")
  .style("font-family","Segoe UI")
  .style("font-size","12px");

  x.domain([1896,2020]);
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  y1.domain([0,3000]);
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.Year); })
      .attr("y", function(d) { return d.data.Season==1?y(d[1]):y1(d[0]); })
      .attr("height", function(d) { return d.data.Season==1? y(d[0])-y(d[1]):y1(d[1])-y1(d[0]); })
      .attr("width", 12)
      .on("mouseover", function(d){

          return tooltip.style("visibility", "visible")
          .html(d.data.Year+" "+d.data.City+ (d.data.Season==1?" Summer":" Winter")+" Olympic Games"
            +"<br/>Male Athletes: "+d.data.Men+"<br/>Female Athletes: "+d.data.Women)
          ;})
	  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height-105) + ")")
      .call(d3.axisBottom(x));

  g.append("g")
    .attr("class","axis")
    .call(d3.axisLeft(y1).ticks(3,"s"))
    .append("text")
    .attr("x", 2)
      .attr("y", y1(y1.ticks().pop()) - 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Winter Athletes");

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(10, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Summer Athletes");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(20," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
}