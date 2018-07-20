var margin = 0,
    width = 800 - margin,
    height = 600 - margin;

function draw(geo_data) {
  
    var svg = d3.select("#content").select("svg")
        .attr("width", width + margin)
        .attr("height", height + 100 + margin);

/////////////////////////////////////////////////////////////////////////////////////////////
// DRAW GLOBE
// Based on: http://bl.ocks.org/PatrickStotz/1f19b3e4cb848100ffd7
/////////////////////////////////////////////////////////////////////////////////////////////

    var earthcolor = d3.rgb("rgb(255,255,255)");
    var countryfillcolor = d3.rgb("rgb(107,147,214)"); 
    var countrystrokecolor = d3.rgb("rgb(255,255,255)"); 

    var projection = d3.geo.orthographic()
                    .scale(300)
                    .translate([width / 2, height / 2])
                    .clipAngle(90) 
                  //.precision(0.2); 
  
    var pathproj = d3.geo.path().projection(projection);

// drawing a sphere as landmass
    var g = svg.append("g");
        g.append("path")
        .datum({type: "Sphere"})
        .attr("class", "sphere")
        .attr("d", pathproj)
        .attr("fill", earthcolor);

// drawing the worldmap
    var map = svg.append('g').selectAll('path')
             .attr("class", "fill")
             .data(geo_data.features)
             .enter()
             .append('path')
             .attr('d', pathproj)
             .style('fill', countryfillcolor) //country fill
             .style('stroke', countrystrokecolor)
             .style('stroke-width', .5)
             .style('opacity',.8);

             svg.append("text")
             .attr("x", (width / 2))             
             .attr("y", height+30)
             .attr("text-anchor", "middle")  
             .style("font-size", "16px") 
             .text("Host cities in history (1986-2018)");

        /////////////////////////////////////////////////////////////////////////////////
        //draw, spin, and highlight the cities on the world
        function plot_points(data) {  

            // Add city points to map!
            // JSON object (instead of circles) for points allowed to be clipped at "backside" of earth:
            svg.append('g')
            .selectAll("path")
                .data(data,function(d,i){ return d.id })    
                .enter()
                .append("path")
                .datum(function(d) {
                        return {
                            type: "Point",
                            coordinates: [d.lon, d.lat]
                        }; })
                .attr("class","city") //this class is assigned to the "correct" paths. Can I access them individually??
                .attr("d", pathproj);

            // Control the radius of ALL circles!
            pathproj.pointRadius(function(d,i) {
                if (d.type =="Point") {
                    return 4;
                }
            }
        );
        ////////////////////////////////////////////////////////////////////////////////////////////////////                         
        //        Spinning the globe:
        ////////////////////////////////////////////////////////////////////////////////////////////////////                         
        function spinning_globe(){
                var time = Date.now();
                var rotate = [0, 0];
                var velocity = [.015, -0];
                d3.timer(t => {
                    // get current time
                    var dt = Date.now() - time;
                          //Define new projection over a rotating path
                          projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);
                          //Add new projection to the map
                          map.attr('d', pathproj)
                          // Spin city locations: Method with JSON path element - only requires this line:
                          svg.selectAll("path.city").attr("d", pathproj);
                           }); // end timer spinning globe
            }; // end spinning globe
        spinning_globe();
        }; // end plot_points function
////////////////////////////////////////////////////////////////////////////////////////////////////
// loading igem data 
    d3.csv("data/gps.csv", 
        function(d) {
            d['id'] = +d['id'];
            d['lat'] = +d['lat'];
            d['lon'] = +d['lon'];
            return d;
        }, 
        plot_points
    );
  
}; // end of draw function
////////////////////////////////////////////////////////////////////////////////////////////////////