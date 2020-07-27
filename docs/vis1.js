var margin;
var svg;
var x;
var xAxis;
var y;
var yAxis;

window.onload = function(){
    
    //https://www.d3-graph-gallery.com/graph/barplot_button_data_csv.html
    margin = {top: 20, right: 30, bottom: 70, left: 80},
            width = 1300 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

    svg = d3.select("#svgBody")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);

    xAxis = svg.append("g")
        .attr("transform","translate(0," + height + ")");

    y = d3.scaleLinear()
        .range([height, 0]);

    yAxis = svg.append("g")
        .attr("class", "myY");
    
    //default bar plot
    update('awards');
    
    var b1 = document.getElementById("button1");
    var b2 = document.getElementById("button2");
    //https://www.w3schools.com/js/js_htmldom_eventlistener.asp
    b1.addEventListener("click", function() {
        removeSVG();
        update('awards');
    });
    b2.addEventListener("click", function() {
        removeSVG();
        update('meanIMDb');
    });
};

function removeSVG() {
    document.getElementById("svgBody").display = "none";
    document.getElementById("svgBody_title").display = "none";
    d3.select("#xText").remove();
    d3.select("#yText").remove();
    d3.select("#titleText").remove();
}

function update(selectedButton) {
    
    var yMinVal;
    var bVal;
    var yAxisVal;
    var titleVal;
    if(selectedButton == 'meanIMDb') {
        yMinVal = 6;
        bVal = "meanIMDb";
        yAxisVal = "Mean IMDb Score";
        titleVal = "IMDb Score";
    }
    else {
        yMinVal = 0; 
        bVal = "awards";
        yAxisVal = "Number of Awards";
        titleVal = "Number of Awards";
    }
    //https://www.d3-graph-gallery.com/graph/barplot_button_data_csv.html
    d3.csv("os_vis0.csv", function(data){
        //https://stackoverflow.com/questions/29945181/sorting-large-csv-in-d3-js
        data.sort(function(a, b){ return d3.descending(+a[bVal], +b[bVal])});
        //X axis
        x.domain(data.map(function(d) { return d.country; }));
        xAxis.transition().duration(1000).call(d3.axisBottom(x));
        //assign class to xAxis
        xAxis.attr("class", "xAxis");
        //Y axis
        y.domain([yMinVal, d3.max(data, function(d) { return +d[selectedButton] }) ]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));
        //assign class to yAxis
        yAxis.attr("class", "yAxis");
        
        //tooltip
        var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
        
        var u = svg.selectAll("rect")
            .data(data);

        u
            .enter()
            .append("rect")
            .merge(u)
            .attr("class","bar1")
            .on("mouseover", function(d){
                d3.select(this)
                   .style("fill", "#87e6cc");
                //tooltip
                //https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
                div.transition()
                    .duration(200)
                    .style("opacity", 1);
                div.html(d.country + "<br/> Mean IMDb Score: " + d.meanIMDb +
                        "<br/> No. of Awards: " + d.awards + "<br/> % of Awards: " + d.percentAwards)
                    .style("left",(d3.event.pageX - 65) + "px")
                    .style("top", (d3.event.pageY - 60) + "px");
            })
            .on("mouseout", function(d){
                d3.select(this)
                    .style("fill","#3aa2b7");
                //tooltip
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
                
            })
            .transition()
            .duration(1000)
            .attr("x", function(d) {return x(d.country); })
            .attr("y", function(d) {return y(d[selectedButton]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) {return height - y(d[selectedButton]); })
            .attr("fill", "#3aa2b7"); 
        
     var svg_title = d3.select("#svgBody_title");
     svg_title 
        .append("text")
        .attr("id", "titleText")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .style("text-anchor", "middle")
        .text(titleVal + " across Country from 1930 to 2014")
        .attr('font-family', 'Helvetica');
        
        //x axis label
        svg.append("text")  
        .attr("id", "xText")
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                               (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Country")
        .attr('font-family', 'Helvetica')
        .attr('font-size', "14px");

        //y axis label
        svg.append("text")
        .attr("id", "yText")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2) - 10)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yAxisVal)
        .attr('font-family', 'Helvetica')
        .attr('font-size', "14px");

        
        
        
    })
    
};

