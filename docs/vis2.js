var margin;
var svg;
var x;
var xAxis;
var y;
var yAxis;
var svg_legend;

window.onload = function(){
    
    margin = {top: 20, right: 30, bottom: 70, left: 80},
            width = 1000 - margin.left - margin.right,
            height = 405 - margin.top - margin.bottom;

    svg = d3.select("#svgBody1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
     svg_legend = d3.select("#svgBody1_legend") //#svgBody1_legend
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
     addLegend();
     
     //https://observablehq.com/@d3/zoom
     svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1, 15])
      .on("zoom", afterzoom));
    
    //https://observablehq.com/@d3/zoom
    function afterzoom() {
        svg.attr("transform", d3.event.transform);
    };
    
     x = d3.scaleBand()
        .range([0, width])
        .domain(["Best Director","Best Actor","Best Supporting Actor","Best Actress","Best Supporting Actress"])
        .paddingInner(1)
        .paddingOuter(.5);

    xAxis = svg.append("g")
        .attr("transform","translate(0," + height + ")");
    
    y = d3.scaleLinear()
            .range([height, 0]);
    
    yAxis = svg.append("g")
        .attr("class", "myY2");
   
    //call
    showBoxplot();
    

};

function addLegend(){
    
    svg_legend.append("text")
            .attr("x", 200)
            .attr("y", 110)
            .text("Period")
            .attr("alignment-baseline","middle")
            .attr("font-size", "12px");
    
     svg_legend.append("circle")
            .attr("cx",180)
            .attr("cy",130)
            .attr("r", 7)
            .style("fill", "#448AFF")
            .style("stroke", "black");
        
     svg_legend.append("text")
            .attr("x", 200)
            .attr("y", 130)
            .text("1930 - 1946")
            .attr("alignment-baseline","middle");
    
      svg_legend.append("circle")
            .attr("cx",180)
            .attr("cy",150)
            .attr("r", 7)
            .style("fill", "#00BFA5")
            .style("stroke", "black");
        
     svg_legend.append("text")
            .attr("x", 200)
            .attr("y", 150)
            .text("1947 - 1963")
            .attr("alignment-baseline","middle");
    
     svg_legend.append("circle")
            .attr("cx",180)
            .attr("cy",170)
            .attr("r", 7)
            .style("fill", "#FF5252")
            .style("stroke", "black");
        
     svg_legend.append("text")
            .attr("x", 200)
            .attr("y", 170)
            .text("1964 - 1980")
            .attr("alignment-baseline","middle");
    
     svg_legend.append("circle")
            .attr("cx",180)
            .attr("cy",190)
            .attr("r", 7)
            .style("fill", "#FFE082")
            .style("stroke", "black");
        
     svg_legend.append("text")
            .attr("x", 200)
            .attr("y", 190)
            .text("1981 - 1997")
            .attr("alignment-baseline","middle");
    
     svg_legend.append("circle")
            .attr("cx",180)
            .attr("cy",210)
            .attr("r", 7)
            .style("fill", "#D500F9")
            .style("stroke", "black");
        
     svg_legend.append("text")
            .attr("x", 200)
            .attr("y", 210)
            .text("1998 - 2014")
            .attr("alignment-baseline","middle");
    
     svg_legend.append("rect")
        .attr("x", 155)
        .attr("y", 95)
        .attr("width", 120)
        .attr("height", 130)
        .style("fill", "transparent")
        .style("stroke", "black");

};

var q1;
var median;
var q3;
var interQuantileRange;
var min;
var max;

function showBoxplot() {
    d3.csv("os_vis1.csv", function(data){
        //https://www.d3-graph-gallery.com/graph/boxplot_show_individual_points.html
        var stat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function(d) {return d.award;})
            .rollup(function(d) {
                q1 = d3.quantile(d.map(function(g) { return g.avg_vote;}).sort(d3.ascending),.25);
                
                median = d3.quantile(d.map(function(g) { return g.avg_vote;}).sort(d3.ascending),.5);
                
                q3 = d3.quantile(d.map(function(g) { return g.avg_vote;}).sort(d3.ascending),.75);
                
                interQuantileRange = q3 - q1;
                
                min = q1 - 1.5 * interQuantileRange;
                max = q3 + 1.5 * interQuantileRange;
                return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min,   max: max})
                })
            .entries(data);
        //console.log(stat);
        
        xAxis.transition().duration(1000).call(d3.axisBottom(x));
        //assign class to xAxis
        xAxis.attr("class", "xAxis2");
        
        y.domain([5.5, 9.5]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));
        //assign class to yAxis
        
        // Color scale to assign color according to period
        // https://www.d3-graph-gallery.com/graph/scatter_grouped_highlight.html
        var color = d3.scaleOrdinal()
            .domain(["First", "Second", "Third", "Fourth", "Fifth"])
            .range([ "#448AFF", "#00BFA5", "#FF5252", "#FFE082", "#D500F9"])

        //tooltip for boxplot data points
        var div1 = d3.select("body").append("div1")	
        .attr("class", "tooltip1")				
        .style("opacity", 0);
        
        //tooltip for boxplot boxes
        var div2 = d3.select("body").append("div2")	
        .attr("class", "tooltip2")				
        .style("opacity", 0);
        
        var selectPeriod = function(d){
            var selectedP;
            if (d.period === "1930 - 1946") {
                selectedP = "First";
            } else if (d.period === "1947 - 1963") {
                selectedP = "Second";
            } else if (d.period === "1964 - 1980") {
                selectedP = "Third";
            } else if (d.period === "1981 - 1997") {
                selectedP = "Fourth";
            } else if (d.period === "1998 - 2014") {
                 selectedP = "Fifth";
            } 
            return selectedP;
        }
        // Highlight the genre that is hovered
        // https://www.d3-graph-gallery.com/graph/scatter_grouped_highlight.html
        var highlight = function(d){
            var selected_period = selectPeriod(d);
                
            d3.select(this)
              .transition()
              .duration(200)
              .style("fill", color(selected_period))
              .attr("r", 7);
            
            d3.selectAll("." + selected_period)
              .transition()
              .duration(200)
              .style("fill", color(selected_period))
              .attr("r", 7);
            
            //tooltip
            //https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
            div1.transition()
                .duration(200)
                .style("opacity", 1);
            div1.html("Title: " + d.movie + "<br/> IMDb Score: " + d.avg_vote +
                    "<br/> Year of Award: " + d.year_of_award + "<br/> Country: " + d.country)
                .style("left",(d3.event.pageX - 65) + "px")
                .style("top", (d3.event.pageY - 60) + "px");
          }

        // Highlight the genre that is hovered
        var noHighlight = function(d){
            var selected_period = selectPeriod(d);
            
            d3.select(this)
              .transition()
              .duration(200)
              .style("fill", "white")
              .attr("r", 4)
            
            d3.selectAll("." + selected_period)
              .transition()
              .duration(200)
              .style("fill", "white")
              .attr("r", 4 );
            div1.transition()
              .duration(200)
              .style("opacity", 0);
          }
        
       //invisible rect to allow zoom/pan
       //https://www.d3-graph-gallery.com/graph/interactivity_zoom.html#axisZoom
       svg.append("rect")
          .attr("width", width)
          .attr("height", height)
          .style("fill", "none")
          .style("pointer-events", "all")
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        
        //main lines
        svg
            .selectAll("vertLines")
            .data(stat)
            .enter()
            .append("line")
              .attr("x1", function(d){return(x(d.key))})
              .attr("x2", function(d){return(x(d.key))})
              .attr("y1", function(d){return(y(+d.value.min))})
              .attr("y2", function(d){return(y(+d.value.max))})
              .attr("stroke", "black")
              .style("width", 40);
        
        //main box
        var boxWidth = 100
        
        svg
            .selectAll("boxes")
            .data(stat)
            .enter()
            .append("rect")
                .attr("x", function(d){return(x(d.key)-boxWidth/2)})
                .attr("y", function(d){return(y(+d.value.q3))})
                .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
                .attr("width", boxWidth )
                .attr("stroke", "black")
                .style("fill", "#87e6cc")
                .on("mouseover", function(d) {
                    var maxVal = d3.format(",.1f")(d.value.max);
                    var minVal = d3.format(",.1f")(d.value.min);
                    d3.select(this)
                          .style("fill", "#f3771e")
                          .style("stroke-width", 4);
                    div2.transition()
                        .duration(200)
                        .style("opacity", 1);
                    div2.html("Max: " + maxVal + "<br/> Q3: " + d.value.q3 +
                            "<br/> Median: " + d.value.median + "<br/> Q1: " + d.value.q1 +
                              "<br/> Min: " + minVal)
                        .style("left",(d3.event.pageX - 65) + "px")
                        .style("top", (d3.event.pageY - 60) + "px");})
                .on("mouseout", function(d){
                    d3.select(this)
                        .style("fill","#87e6cc")
                        .style("stroke-width", 1);
                    //tooltip
                    div2.transition()
                        .duration(200)
                        .style("opacity", 0)});
        
        // Show the median
        svg
            .selectAll("medianLines")
            .data(stat)
            .enter()
            .append("line")
              .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
              .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
              .attr("y1", function(d){return(y(d.value.median))})
              .attr("y2", function(d){return(y(d.value.median))})
              .attr("stroke", "black")
              .style("width", 80);

        // Add individual points with jitter
        var jitterWidth = 50;
        svg
          .selectAll("indPoints")
          .data(data)
          .enter()
          .append("circle")
            .attr("class", function (d) { 
                var periodCategory = selectPeriod(d);
                return "indPoints " + periodCategory; } )
            .attr("cx", function(d){return(x(d.award) - jitterWidth/2 + Math.random()*jitterWidth )})
            .attr("cy", function(d){return(y(d.avg_vote))})
            .attr("r", 4)
            .style("fill", "white")
            .attr("stroke", "black")
            .on("mouseover", highlight)
            .on("mouseout", noHighlight);
        
        
        var svg_title = d3.select("#svgBody1_title");
        svg_title 
        .append("text")
        .attr("id", "titleText")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .style("text-anchor", "middle")
        .text("IMDb Score across Academy Award")
        .attr('font-family', 'Helvetica');
        
        //x axis label
        svg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                               (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Academy Award")
        .attr('font-family', 'Helvetica')
        .attr('font-size', "14px");

        //y axis label
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2) - 10)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("IMDb Score")
        .attr('font-family', 'Helvetica')
        .attr('font-size', "14px");

        
        

    });
        
};