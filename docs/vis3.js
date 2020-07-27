var margin;
var svg;
var svg_legend;
var x;
var xAxis;
var y;
var yAxis;

window.onload = function(){
    
    margin = {top: 20, right: 30, bottom: 70, left: 80},
            width = 1300 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

    svg = d3.select("#svgBody2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg_legend = d3.select("#svgBody2_legend") 
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
    //call
    addLegend();
    showHeatmap("Descending Order");
    
    var b1 = document.getElementById("button3");
    var b2 = document.getElementById("button4");
    //https://www.w3schools.com/js/js_htmldom_eventlistener.asp
    b1.addEventListener("click", function() {
        removeSVG();
        showHeatmap("Descending Order");
    });
    b2.addEventListener("click", function() {
        removeSVG();
        showHeatmap("Ascending Order");
    });
    
};


function removeSVG() {
    d3.select("#xText2").remove();
    d3.select("#yText2").remove();
    d3.select("#title2").remove();
    d3.select("#xAxis_v2").remove();
    d3.select("#yAxis_v2").remove();
    svg.selectAll("rect").remove();
};


function addLegend(){

    svg_legend.append("text")
            .attr("x", 205)
            .attr("y", 115)
            .text("Number of Movies per Genre")
            .attr("alignment-baseline","middle")
            .attr("font-size", "12px");
    
     svg_legend.append("rect")
            .attr("x",170)
            .attr("y",130)
            .attr("width", 10)
            .attr("height", 16)
            .attr("rx", 2)
            .attr("ry", 2)
            .style("fill", "#ffffff")
            .style("stroke", "black");
        
     svg_legend.append("text")
            .attr("x", 190)
            .attr("y", 140)
            .text("0")
            .attr("alignment-baseline","middle");
    
     svg_legend.append("rect")
            .attr("x",210)
            .attr("y",130)
            .attr("width", 10)
            .attr("height", 16)
            .attr("rx", 2)
            .attr("ry", 2)
            .style("fill", "#FFE0B2")
            .style("stroke", "black");
    
     svg_legend.append("text")
            .attr("x", 230)
            .attr("y", 140)
            .text("1")
            .attr("alignment-baseline","middle");
    
     svg_legend.append("rect")
            .attr("x",250)
            .attr("y",130)
            .attr("width", 10)
            .attr("height", 16)
            .attr("rx", 2)
            .attr("ry", 2)
            .style("fill", "#FFB300")
            .style("stroke", "black");
    
     svg_legend.append("text")
            .attr("x", 270)
            .attr("y", 140)
            .text("2")
            .attr("alignment-baseline","middle");
    
    svg_legend.append("rect")
            .attr("x",290)
            .attr("y",130)
            .attr("width", 10)
            .attr("height", 16)
            .attr("rx", 2)
            .attr("ry", 2)
            .style("fill", "#FF8F00")
            .style("stroke", "black");
    
     svg_legend.append("text")
            .attr("x", 310)
            .attr("y", 140)
            .text("3")
            .attr("alignment-baseline","middle");
    
    svg_legend.append("rect")
            .attr("x",330)
            .attr("y",130)
            .attr("width", 10)
            .attr("height", 16)
            .attr("rx", 2)
            .attr("ry", 2)
            .style("fill", "#FF6F00")
            .style("stroke", "black");
    
     svg_legend.append("text")
            .attr("x", 350)
            .attr("y", 140)
            .text("4")
            .attr("alignment-baseline","middle");
    
    svg_legend.append("rect")
            .attr("x",370)
            .attr("y",130)
            .attr("width", 10)
            .attr("height", 16)
            .attr("rx", 2)
            .attr("ry", 2)
            .style("fill", "#BF360C")
            .style("stroke", "black");
    
     svg_legend.append("text")
            .attr("x", 390)
            .attr("y", 140)
            .text("5")
            .attr("alignment-baseline","middle");
    
     svg_legend.append("rect")
        .attr("x", 158)
        .attr("y", 102)
        .attr("width", 250)
        .attr("height", 50)
        .style("fill", "transparent")
        .style("stroke", "black");

};

function showHeatmap(selectedButton) {
    //https://www.d3-graph-gallery.com/graph/heatmap_style.html
     var parseDate = d3.timeParse("%Y");
    
     var bVal;
     var numMovies = 0;

     d3.csv("os_vis3.csv", function(data){
        if(selectedButton == 'Ascending Order') {
           bVal = "sumMovies";
            data.sort(function(a,b){
            return d3.descending(+a[bVal], +b[bVal])});
        }
        else if (selectedButton == 'Descending Order'){
            bVal = "sumMovies";
            data.sort(function(a,b){
            return d3.ascending(+a[bVal], +b[bVal])});
        }
         
        data.forEach(function (d) {
            d.originYear = d.year_of_award;
            d.year_of_award = parseDate(d.year_of_award);
        });
         
        var vars = d3.map(data, function(d) {return d.genre;}).keys();
        
        x = d3.scaleTime().range([0,width]);
        y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(vars)
            .padding(0.005);
         
        x.domain(d3.extent(data, function(d) {return d.year_of_award;}))

        xAxis = svg.append("g")
            .style("font-size", 12)
            .attr("transform", "translate(0," + height + ")")
            .attr("id", "xAxis_v2");
        
         xAxis.transition().duration(1000).call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%Y")))
             .select(".domain").remove();
         
         yAxis = svg.append("g")
            .style("font-size", 12)
            .attr("id", "yAxis_v2")
             .transition().duration(1000)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove();

        // Color scale to assign color according to period
        // https://www.d3-graph-gallery.com/graph/scatter_grouped_highlight.html
        var color = d3.scaleOrdinal()
            .domain([1,2,3,4,5])
            .range(["#FFE0B2", "#FFB300","#FF8F00","#FF6F00","#BF360C"]);

        //tooltip for heatmap
        var div3 = d3.select("body").append("div3")	
        .attr("class", "tooltip3")				
        .style("opacity", 0);

        // Highlight the heatmap that is hovered
        // https://www.d3-graph-gallery.com/graph/scatter_grouped_highlight.html
        var highlight = function(d){
            d3.select(this)
              .transition()
              .duration(200)
              .style("stroke","black");

            //tooltip
            //https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
            div3.transition()
                .duration(200)
                .style("opacity", 1);
        
            div3.html("Genre: " + d.genre + "<br/> Count: " + d.count +
                    "<br/> Year of Award: " + d.originYear)
                .style("left",(d3.event.pageX - 65) + "px")
                .style("top", (d3.event.pageY - 60) + "px");
          }

        // Highlight the heatmap that is hovered
        var noHighlight = function(d){

            d3.select(this)
              .transition()
              .duration(200)
              .style("stroke","none");

            div3.transition()
              .duration(200)
              .style("opacity", 0);
          }
        
        //add squares 
        svg.selectAll()
            .data(data, function(d) {return d.year_of_award + ":" + d.genre})
            .enter()
            .append("rect")
             .attr("x", function(d) { return x(d.year_of_award) })
              .attr("y", function(d) { return y(d.genre) })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("width", width/84 )
              .attr("height", y.bandwidth() -1 )
              .style("fill", function(d) { 
               
                return color(d.count);
                })
              .style("stroke-width", 4)
              .style("stroke", "none")
              .style("opacity", 0.8)
            .on("mouseover", highlight)
            .on("mouseout", noHighlight);

        var svg_title = d3.select("#svgBody2_title");
        svg_title 
        .append("text")
         .attr("id","title2")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .style("text-anchor", "middle")
        .text("Film Genre from 1930 to 2014")
        .attr('font-family', 'Helvetica');
         
        //x axis label
        svg.append("text")  
        .attr("id","xText2")
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                               (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Year")
        .attr('font-family', 'Helvetica')
        .attr('font-size', "14px");

        //y axis label
        svg.append("text")
        .attr("id","yText2")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 3)
        .attr("x", 0 - (height / 2) - 10)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Film Genre")
        .attr('font-family', 'Helvetica')
        .attr('font-size', "14px");

        

    });
    
        
};