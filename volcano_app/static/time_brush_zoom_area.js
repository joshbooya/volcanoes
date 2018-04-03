// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);
// When the browser loads, makeResponsive() is called.
makeResponsive();

// The code for the chart is wrapped inside a function that automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and height of the browser window.
    var svgWidth = window.innerWidth * 0.98;
        svgHeight = window.innerHeight  * 0.98,

        //TOP CHART
        margin = {
            top: svgHeight * 0.02, 
            right: svgWidth * 0.02,
            bottom: svgHeight * 0.65, 
            left: 40
        },
        
        // BOTTOM CHART
        margin2 = {
            top: svgHeight * 0.4, 
            right: svgWidth * 0.02, 
            bottom: svgHeight * 0.55, 
            left: 40
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

    d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);
    
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

    var area = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return x(new Date(d.start_year,0,1))})  //formatYear(new Date(d.start_year,0,1))); })
        .y0(height)
        .y1(function(d) { return y(d.eruptions); });

    var area2 = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return x2(new Date(d.start_year,0,1)); })
        .y0(height2)
        .y1(function(d) { return y2(d.eruptions); });

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

        console.log("data:", data);
        
        //TOP
        x.domain([start_point, end_point]);
        y.domain([0, d3.max(data, function(d) { return d.eruptions; })]);
        //Bottom
        x2.domain(x.domain());
        y2.domain(y.domain());

        // console.log('xdomain',x.domain());
        // console.log('x2domain',x2.domain());
        // console.log('ydomain',y.domain());
        // console.log('y2domain',y2.domain());

        focus.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);
        
        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);
        
        context.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area2);
        
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
    });
        
    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
        focus.select(".area").attr("d", area);
        focus.select(".axis--x").call(xAxis);
        svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }
        
    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        x.domain(t.rescaleX(x2).domain());
        focus.select(".area").attr("d", area);
        focus.select(".axis--x").call(xAxis);
        context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }
}