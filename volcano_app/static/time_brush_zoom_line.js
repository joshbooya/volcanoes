// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);
// When the browser loads, makeResponsive() is called.
makeResponsive();

// The code for the chart is wrapped inside a function that automatically resizes the chart
function makeResponsive() {

    // if the SVG line isn't empty when the browser loads, remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and height of the browser window.
    var svgWidth = window.innerWidth * 0.95;
        svgHeight = window.innerHeight * 0.95,

        //TOP CHART
        margin = {
            top: svgHeight * 0.035, 
            right: svgWidth * 0.02,
            bottom: svgHeight * 0.25, 
            left: svgHeight * 0.02
        },
        
        // BOTTOM CHART
        margin2 = {
            top: svgHeight * 0.81, 
            right: svgWidth * 0.02, 
            bottom: svgHeight * 0.075, 
            left: svgHeight * 0.02
        },
            
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;
        height2 = (svgHeight - margin2.top - margin2.bottom); 

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate("+ margin.left + "," + margin.top +")");

    var chart = svg.append("g");

    // d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);
    
    var bisectDate = d3.bisector(function(d) { return(new Date(d.start_year,0,1)); }).left;


    var x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),

        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);

        // console.log('y2', y2)
    var xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y);

    var brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush end", brushed);
        // // console.log('brush', brush)
        
    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    // var area = d3.area()
    //     // .curve(d3.curveMonotoneX)
    //     .x(function(d) { return x(new Date(d.start_year,0,1))})
    //     .y0(height)
    //     .y1(function(d) { return y(d.eruptions); });

    // var area2 = d3.area()
    //     // .curve(d3.curveMonotoneX)
    //     .x(function(d) { return x2(new Date(d.start_year,0,1)); })
    //     .y0(height2)
    //     .y1(function(d) { return y2(d.eruptions); });

    var line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return x(new Date(d.start_year,0,1))})
        .y(function(d) { return y(d.eruptions); });

    var line2 = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return x2(new Date(d.start_year,0,1))})
        .y(function(d) { return y2(d.eruptions); });

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
    .append("rect")
        .attr("width", width)
        .attr("height", height);
        // console.log('height', height)
    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // console.log('margin.top', margin.top)
    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var url = `database/yearly_count`
    var start_point = new Date(1750,0,1);
    var end_point = new Date(2010,0,1);
    // var start_point = new Date((d3.min(data, function(d) {return(d.start_year)}) ),0,1);
    // var end_point = new Date((d3.max(data, function(d) {return(d.start_year)})),0,1);

    // JavaScript new Date method cannot handle negative dates properly even with the brush method
    d3.json(url, function(error, data) {
        if (error) return console.warn(error);
        
        data.forEach(function(d) {
            d.date = new Date(d.start_year,0,1);
            d.eruptions = +d.eruptions;
          });

        console.log("data:", data);
        
        //TOP
        x.domain([start_point, end_point]);
        y.domain([0, d3.max(data, function(d) { return d.eruptions; })]);
        
        //Bottom
        x2.domain(x.domain());
        y2.domain(y.domain());

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);
        

        // context.append("path")
        //     .datum(data)
        //     .attr("class", "area")
        //     .attr("d", area2);

        context.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line2);
        
        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);
        
        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());
        
        svg.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);


        // Start Animation on Click
        d3.select("#start").on("click", function() {
            var path = focus.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);

            // Variable to Hold Total Length
            var totalLength = path.node().getTotalLength();

            path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition() // Call Transition Method
                .duration(6500) // Set Duration timing (ms)
                .ease(d3.easeLinear) // Set Easing option
                .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition

            // // Create SVG for Tooltip and Circle on Mouseover
            // var focusTip = svg.append("g")
            // .attr("class", "focusTip")
            // .style("display", "none");

            // // Append a circle to show on Mouseover
            // focusTip.append("circle")
            //     .attr("r", 4.5);

            // // Append text to show on Mouseover
            // focusTip.append("text")
            //     .attr("x", 9)
            //     .attr("dy", ".35em");

            //// Append overlay rectangle as container for Circle and Tooltips
            //// that allows user to hover anywhere on graphic
            // svg.append("rect")
            //     .attr("class", "overlay")
            //     .attr("width", width)
            //     .attr("height", height)
                // .on("mouseover", function() { focusTip.style("display", null); })
                // .on("mouseout", function() { focusTip.style("display", "none"); })
                // .on("mousemove", mousemove);

            // //// Mousemove function that sets location and changes properties of FocusTip SVG
            // function mousemove() {
            // var x0 = x.invert(d3.mouse(this)[0]),
            
            //     i = bisectDate(data, x0, 1),
            //     d0 = data[i - 1],
            //     d1 = data[i],
            //     d = x0 - (new Date(d0.start_year,0,1)) > (new Date(d1.start_year,0,1)) - x0 ? d1 : d0;
            //     console.log('x0',x0)
            // focusTip.attr("transform", "translate(" + x(new Date(d.start_year,0,1)) + "," + y(d.eruptions) + ")");
            // focusTip.select("text").text(d.eruptions);
            // }
        });
        
        // Reset Animation
        d3.select("#reset").on("click", function() {
            d3.select(".line").remove();
        });
        
    });

    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
        focus.select(".line").attr("d", line);
        focus.select(".axis--x").call(xAxis);
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }
        
    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        x.domain(t.rescaleX(x2).domain());
        focus.select(".line").attr("d", line);
        focus.select(".axis--x").call(xAxis);
        context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }
    
}