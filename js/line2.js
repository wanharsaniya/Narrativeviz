// set the dimensions and margins of the graph 10,30,30,60
var margin = {top: 20, right: 40, bottom: 40, left: 70},
    width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
// create a tooltip
    var Tooltip = d3.select("#my_line")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute")

// append the svg object to the body of the page
var svg = d3.select("#my_line")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
          

      

//Read the dataaa
d3.csv("connectedscatter.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
  }).then(

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width  ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [8000, 9200])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

    

      // Three function that change the tooltip when user hover / move / leave a cell
      
      var mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
          .html("Exact value: " + d.value)
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      }
      var mousemove = function(d) {
        Tooltip
          .html("Exact value: " + d.value)
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      }
      var mouseleave = function(d) {
        Tooltip
          .style("opacity", 0)
      }

    // Add the points
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 4)
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
      
      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Earnings");
      
      var parseDate = function(d){ return d3.timeParse("%Y-%m-%d")(d)}
      const annotations = [
       // first annotation
        {
      note: {
        label: "ttEarnings plummeted",
        title: "April 17th - 19th",
        wrap: 150,  // try something smaller to see text split in several lines
        padding: 10   // More = text lower
      
     },
     color: ["#cc0000"],
     x: x(parseDate('2015-01-01')),
     y: y(8197),
     dy: -100,
     dx: -5,
     subject: {
      radius: 50,
      radiusPadding: 5
    },
    type: d3.annotationCalloutCircle,
    },
    // second annotation
        {
      note: {
        label: "Strong Recovery",
        title: "April 20th",
        wrap: 150,  // try something smaller to see text split in several lines
        padding: 10   // More = text lower
      
     },
     color: [" #00b300"],
     x: x(parseDate('2015-07-01')),
     y: y(8880.23),
     dy: 40,
     dx: 40,
    type: d3.annotationCalloutElbow,
    },
    
      ]
      
      window.makeAnnotations = d3.annotation()
        .annotations(annotations)
     
        svg.append("g")
    .call(makeAnnotations)
})
