var margin;
var svg;
var svg_title; 
var svg_legend;
var x;
var xAxis;
var y;
var yAxis;
var titlePeriod;
var titleYaxis;
var titleYaxis2;
var lastData;
var yValue;
var stat_sort;
var sortOption;
var topBottom;

window.onload = function(){
    
    margin = {top: 20, right: 30, bottom: 70, left: 80},
            width = 1300 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

    svg = d3.select("#svgBody3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

    //https://observablehq.com/@d3/zoom
    svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1, 15])
      .on("zoom", afterzoom));
    
    //https://observablehq.com/@d3/zoom
    function afterzoom() {
        svg.attr("transform", d3.event.transform);
    };
    
    yAxis = svg.append("g");
    
    xAxis = svg.append("g")
        .attr("transform","translate(0," + height + ")");
    
    titlePeriod = "from 1930 to 2014";
    titleYaxis = "IMDb Score";
    titleYaxis2 = "";
    sortOption = "descending";
    topBottom = "Top 10:";
    
    //default to show all period
    getData();
    
};

//https://d3-legend.susielu.com/
function addViolinLegend(getYaxis){
    
    var yValueDomain; 
    var shapeSize;
    var rectSize;
    
    if (getYaxis == "IMDb Score"){
       yValueDomain = ["5.0", "5.6", "6.1", "6.7", "7.2", "7.8", "8.3", "8.9", "9.4", "10.0"];
        shapeSize = 16;
        rectSize = 200;
    } else if (getYaxis == "Runtime"){
        yValueDomain = ["60", "80", "100", "120", "140", "160", "180", "200", "220", "240"];
        shapeSize = 16;
        rectSize = 200;
    };

    var colorScale = d3.scaleOrdinal(d3.interpolateTurbo)
    .domain(yValueDomain).range(["rgb(35,24,28)","rgb(72,96,230)","rgb(42,171,238)","rgb(45,229,174)","rgb(106,253,106)","rgb(192,238,61)","rgb(254,185,38)","rgb(254,110,25)","rgb(194,40,10)","rgb(144,13,0)"]);
    
    svg_legend = d3.select("#svgBody3_legend");
    
    svg_legend.append("g")
      .attr("class", "violinLegend")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("font-size", "10px");

    var violinLegend = d3.legendColor()
        .shapeWidth(shapeSize)
        .cells(10)
        .orient("horizontal")
        .scale(colorScale); 

    svg_legend.select(".violinLegend")
      .call(violinLegend);
    
    svg_legend.append("text")
            .attr("x", rectSize/2 + 30)
            .attr("y", 9)
            .text(titleYaxis + " " + titleYaxis2)
            .attr("alignment-baseline","middle")
            .attr("font-size", "12px")
            .attr("id", "violinLegendText");
    
     svg_legend.append("rect")
        .attr("x", 70)
        .attr("y", -3)
        .attr("width", rectSize)
        .attr("height", 60)
        .style("fill", "transparent")
        .style("stroke", "black")
        .attr("id", "violinLegendRect");

};

function getData(){
     d3.csv("os_vis2.csv", function(data){

     var allPeriod = ["All period", "1930 - 1946","1947 - 1963","1964 - 1980", "1981 - 1997" ,"1998 - 2014"];    

     //https://www.d3-graph-gallery.com/graph/line_select.html
     d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allPeriod)
        .enter()
        .append('option')
        .text(function (d) {return d;}) //menu shows text
        .attr("value", function (d) {return d;})

     d3.select("#selectButton2")
        .selectAll('myOptions')
        .data(["IMDb Score","Runtime"])
        .enter()
        .append('option')
        .text(function (d) {return d;}) //menu shows text
        .attr("value", function (d) {return d;})
         
    d3.select("#selectButton3")
        .selectAll('myOptions')
        .data(["Descending","Ascending"])
        .enter()
        .append('option')
        .text(function (d) {return d;}) //menu shows text
        .attr("value", function (d) {return d;})
        
        
     sortByMedian(data)

    // When the button is changed, update
    d3.select("#selectButton").on("change", function(d) {
        var selectedOption = d3.select(this).property("value");
        svg.selectAll("circle").remove();
        svg.selectAll("path").remove();    
        svg_title.selectAll("text").remove();
        d3.select("#yText").remove();
        d3.select("#xText").remove();
        d3.select("#violinLegendText").remove(); 
        d3.select("#violinLegendRect").remove();
        d3.select("#tooltip5").remove();
        d3.select("#tooltip6").remove();
        updateViolin(selectedOption, data);
       
    }); 
         
     d3.select("#selectButton2").on("change", function(d) {
        var selectedOption2 = d3.select(this).property("value");
        svg.selectAll("circle").remove();
        svg.selectAll("path").remove();    
        svg_title.selectAll("text").remove();
        d3.select("#yText").remove();
        d3.select("#xText").remove();
        d3.select("#violinLegendText").remove(); 
        d3.select("#violinLegendRect").remove();
        d3.select("#tooltip5").remove();
        d3.select("#tooltip6").remove();

        updateViolin2(selectedOption2, lastData);
    }); 
         
     d3.select("#selectButton3").on("change", function(d) {
        var selectedOption3 = d3.select(this).property("value");
        svg.selectAll("circle").remove();
        svg.selectAll("path").remove();    
        svg_title.selectAll("text").remove();
        d3.select("#yText").remove();
        d3.select("#xText").remove();
        d3.select("#violinLegendText").remove(); 
        d3.select("#violinLegendRect").remove();
        d3.select("#tooltip5").remove();
        d3.select("#tooltip6").remove();

    updateViolin3(selectedOption3, lastData);
    }); 
         
})                                                                  
};

function updateViolin(selectedPeriod, data){
        
        if (selectedPeriod == "All period"){
            titlePeriod = "from 1930 to 2014";
            data = data;
        } else if (selectedPeriod == "1930 - 1946") {
             data = data.filter(function(d) {
                titlePeriod = "from 1930 to 1946";
                 return (d["year_of_award"] >= 1930 && 
                     d["year_of_award"] <= 1946); })
        } else if (selectedPeriod == "1947 - 1963") {
             data = data.filter(function(d) {
                 titlePeriod = "from 1947 to 1963";
                 return (d["year_of_award"] >= 1947 && 
                     d["year_of_award"] <= 1963); })
        } else if (selectedPeriod == "1964 - 1980") {
             data = data.filter(function(d) {
                 titlePeriod = "from 1964 to 1980";
                 return (d["year_of_award"] >= 1964 && 
                     d["year_of_award"] <= 1980); })
        } else if (selectedPeriod == "1981 - 1997") {
             data = data.filter(function(d) {
                 titlePeriod = "from 1981 to 1997";
                 return (d["year_of_award"] >= 1981 && 
                     d["year_of_award"] <= 1997); })
        } else if (selectedPeriod == "1998 - 2014") {
             data = data.filter(function(d) {
                 titlePeriod = "from 1998 to 2014";
                 return (d["year_of_award"] >= 1998 && 
                     d["year_of_award"] <= 2014);})
        }     
        
        lastData = data;
        sortByMedian(lastData);
};

function updateViolin2(selectedOption, data){
      if (selectedOption == "IMDb Score") {
            titleYaxis = "IMDb Score";
        } else if (selectedOption == "Runtime") {
            titleYaxis = "Runtime";
        }
        sortByMedian(data);
};

function updateViolin3(selectedOption, data){
     if (selectedOption == "Descending") {
            sortOption = "descending";
            topBottom = "Top 10:";
        } else if (selectedOption == "Ascending") {
            sortOption = "ascending";
            topBottom = "Bottom 10:";
        }
        sortByMedian(data);
};

function sortByMedian(data){
     
    if (titleYaxis == "IMDb Score"){
            yValue = "avg_vote";
            titleYaxis2 = "";
        } else if (titleYaxis == "Runtime"){
            yValue = "duration";
            titleYaxis2 = "(minutes)";
        }
    
    stat_sort = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) {return d.genre;})
        .rollup(function(d) {
            q1 = d3.quantile(d.map(function(g) { return g[yValue];}).sort(d3.ascending),.25);
            median = d3.quantile(d.map(function(g) { return g[yValue];}).sort(d3.ascending),.5);
            q3 = d3.quantile(d.map(function(g) { return g[yValue];}).sort(d3.ascending),.75);
            interQuantileRange = q3 - q1;
            min = q1 - 1.5 * interQuantileRange;
            max = q3 + 1.5 * interQuantileRange;
            return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min,   max: max})
            })
        .entries(data);
    
    for (i in stat_sort) {
        data.forEach(function (d) {
            if(d.genre ==  stat_sort[i].key){
                d.maxValue = stat_sort[i].value.max;
                d.q3Value = stat_sort[i].value.q3;
                d.medianValue = stat_sort[i].value.median;
                d.q1Value = stat_sort[i].value.q1;
                d.minValue = stat_sort[i].value.min;
                console.log(stat_sort[i].key + " " + d.medianValue);
            }
        });     
    }
    
    data.sort(function(a,b){
        
        if (sortOption == "descending"){
            return d3.descending(a.medianValue, b.medianValue);
        }  else if (sortOption == "ascending"){
            return d3.ascending(a.medianValue, b.medianValue);
        } 
    });
    
    lastData = data;
    showViolin(lastData);
    addViolinLegend(titleYaxis);
};
                                  
//https://www.d3-graph-gallery.com/graph/violin_jitter.html
function showViolin(data){
        var tempMedian;    
        var tempScore;
    
        //list genres
        var vars = d3.map(data, function(d) {return d.genre;}).keys();
        //get medianValues per genre
        var vars2 = [];
        var count;
        for (k in vars) {
            count = 0;
            for (var i = 0; i < data.length; i++){
                if (vars[k] === data[i].genre){
                    if (count === 0) {
                        var thisMedian =  Math.round(data[i].medianValue * 100) / 100;
                        vars2.push(thisMedian);
                        count += 1;
                    }
                }
            }
        }    
    
    d3.map(data, function(d) {
            if (titleYaxis == "IMDb Score") {
                tempMedian = titleYaxis;
                tempScore = d.medianValue
                tempScore = Math.round(tempScore * 100) / 100;
                //console.log(tempScore);
                return tempScore;
                
            } else if (titleYaxis == "Runtime") {
                tempMedian = "Runtime";
                return d.medianValue.toFixed();
            }}).keys();

    
        //tooltip for "Top 10/Bottom 10 by Median"
        var div6 = d3.select("body").append("div6")
            .attr("class","tooltip6")
            .attr("id", "tooltip6")
            .style("opacity", 0)
        
        var div5 = d3.select("body").append("div5")	
            .attr("class", "tooltip5")		
            .attr("id", "tooltip5")
            .style("opacity", 0);
    
        var showStat = function(d){
            div6.transition()
                .duration(200)
                .style("opacity",1)
            
            div5.transition()
                .duration(200)
                .style("opacity",1)
            
            div6.html(topBottom)
                .style("left", d + "px")
                .style("right", d + "px")
            
            div5.html("1. " + "<strong>" + vars[0]+ "</strong>" + ", Median "+ tempMedian + ": " + "<strong>" + vars2[0]+ "</strong>" + " " + titleYaxis2 + "<br>2.  " +  "<strong>" + vars[1]+ "</strong>" + ", Median "+ tempMedian + ": " +"<strong>" + vars2[1]+ "</strong>" + " " + titleYaxis2  + "<br>3.  " + "<strong>" + vars[2]+ "</strong>" + ", Median "+ tempMedian + ": " + "<strong>" + vars2[2]+ "</strong>" + " " + titleYaxis2 + "<br>4.  " + "<strong>" + vars[3]+ "</strong>" + ", Median "+ tempMedian + ": " + "<strong>" + vars2[3]+ "</strong>" + " " + titleYaxis2  + "<br>5.  " + "<strong>" + vars[4]+ "</strong>" + ", Median "+ tempMedian + ": " + "<strong>" + vars2[4]+ "</strong>" + " " + titleYaxis2 + "<br>6.  " + "<strong>" + vars[5]+ "</strong>" + ", Median "+ tempMedian + ": " + "<strong>" + vars2[5]+ "</strong>" + " " + titleYaxis2 + "<br>7.  " + "<strong>" + vars[6]+ "</strong>" + ", Median "+ tempMedian + ": " + "<strong>" + vars2[6]+ "</strong>" + " " + titleYaxis2 + "<br>8.  " + "<strong>" + vars[7]+ "</strong>" + ", Median "+ tempMedian + ": " + "<strong>" + vars2[7]+ "</strong>" + " " + titleYaxis2 +"<br>9.  " + "<strong>" + vars[8]+ "</strong>" + ", Median "+ tempMedian + ": " + "<strong>" + vars2[8]+ "</strong>" + " " + titleYaxis2 + "<br>10.  " + "<strong>" + vars[9]+ "</strong>" + ", Median "+ tempMedian + ": " + "<strong>" + vars2[9]+ "</strong>" + " " + titleYaxis2)  
                .style("left", d + "px")
                .style("right", d + "px")
        }
        
        showStat(data);
    
        //title
        svg_title = d3.select("#svgBody3_title");
        svg_title 
        .append("text")
        .attr("id", "titleText2")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .style("text-anchor", "middle")
        .text(titleYaxis + " across  Genre " + titlePeriod)
        .attr('font-family', 'Helvetica');
    
        x = d3.scaleBand()
        .range([0, width]).domain(data.map(function(d) { return d.genre; })).paddingInner(0.5)
        .paddingOuter(0.8); //space between two groups 0<padding<1 
         
        var minDomain; 
        var maxDomain;
        if (yValue == "avg_vote"){
            minDomain = 5;
            maxDomain = 10;
        } else if (yValue == "duration"){
            minDomain = 60;
            maxDomain = 240;
        }
    
        y = d3.scaleLinear()
        .domain([minDomain, maxDomain])
        .range([height, 0]);
    
        xAxis.transition().duration(1000).call(d3.axisBottom(x));
    
        yAxis.transition().duration(1000).call(d3.axisLeft(y));
      
        //Features of the histogram
        var histogram = d3.histogram()
                .domain(y.domain())
                .thresholds(y.ticks(20)) // no. of bins going to be made => resolution of the violin plot
                .value(d => d)

        //Compute the binning for each genre
        var stat = d3.nest()  // nest function allows to group the calculation per level of a factor
            .key(function(d) { return d.genre;})
            .rollup(function(d) {   // For each key..
              input = d.map(function(g) { return g[yValue];}) 
              bins = histogram(input);//compute the binning on it
              return(bins)
            })
            .entries(data)

        //the biggest number of value in a bin, this value will have a width of 100% of the bandwidth.
        var maxNum = 0;
        for ( i in stat ){
            allBins = stat[i].value;
            lengths = allBins.map(function(a){return a.length;})
            longest = d3.max(lengths)
            if (longest > maxNum) { maxNum = longest }
          };

       //The maximum width of a violin must be x.bandwidth = the width dedicated to a group
       var xNum = d3.scaleLinear()
        .range([0, x.bandwidth()])
        .domain([-maxNum,maxNum]);
        
        //Color scale for dots
        //https://github.com/d3/d3-scale-chromatic
        
        var color = d3.scaleSequential()
        .interpolator(d3.interpolateTurbo) //interpolateYlOrRd
        .domain([minDomain,maxDomain]);
        
        //tooltip for data points
        var div4 = d3.select("body").append("div4")	
            .attr("class", "tooltip4")				
            .style("opacity", 0);
        
        // Highlight the data point that is hovered
        // https://www.d3-graph-gallery.com/graph/scatter_grouped_highlight.html
        var highlight = function(d){
        
            d3.select(this)
              .transition()
              .duration(200)
              .style("fill", color(d[yValue]))
              .attr("r", 10);
            
            //tooltip
            div4.transition()
                .duration(200)
                .style("opacity", 1);
            
            div4.html("Title: " + d.movie + "<br/> IMDb Score: " + d.avg_vote + "<br/> Genre: " + d.genre + "<br/> Runtime: " + d.duration +" mins" + "<br/> Year of Award: " + d.year_of_award)
                .style("left",(d3.event.pageX - 65) + "px")
                .style("top", (d3.event.pageY - 75) + "px");
        }

        // when mouseout
        var noHighlight = function(d){
            d3.select(this)
              .transition()
              .duration(200)
              .style("fill", color(d[yValue])) //avg_vote or duration
                .attr("r", 4);

            div4.transition()
              .duration(200)
              .style("opacity", 0);
        };
        
       //invisible rect to allow zoom/pan
       //https://www.d3-graph-gallery.com/graph/interactivity_zoom.html#axisZoom
       svg.append("rect")
          .attr("width", width)
          .attr("height", height)
          .style("fill", "none")
          .style("pointer-events", "all")
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
        //Add the shape
        svg
        .selectAll("myViolin")
        .attr("id","v3Shape")
        .attr("class", "myViolin")
        .data(stat)
        .enter()        //working group per group
        .append("g")
          .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)");}) //Translation on the right to be at the group position
        .append("path")
            .datum(function(d){ return(d.value)}) //working bin per bin
            .style("stroke", "none")
            .style("fill","grey")
            .attr("d", d3.area()
                .x0( xNum(0) )
                .x1(function(d){ return(xNum(d.length)) } )
                .y(function(d){ return(y(d.x0)) } )
                .curve(d3.curveCatmullRom) // makes the line smoother to give the violin appearance. Alternatively, d3.curveStep 
            );

      // Add individual points with jitter
      var jitterWidth = 40;
      svg
        .selectAll("indPoints")
        .attr("class", "indPoints")
        .attr("id","v3Points")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", function(d){return(x(d.genre) + x.bandwidth()/2 - Math.random()*jitterWidth )})
          .attr("cy", function(d){return(y(d[yValue]))})
          .attr("r", 4)
          .style("fill", function(d){ return(color(d[yValue]))})
          .attr("stroke", "black")
            .on("mouseover", highlight)
            .on("mouseout", noHighlight);
    
     //x axis label
     svg.append("text")
        .attr("id", "xText")
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                               (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Genre")
        .attr('font-family', 'Helvetica')
        .attr('font-size', "14px");

     //y axis label
     svg.append("text")
        .attr("id", "yText")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left +20)
        .attr("x", 0 - (height / 2) - 10)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(titleYaxis + " " + titleYaxis2)
        .attr('font-family', 'Helvetica')
        .attr('font-size', "14px");
 
    
};