// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

// Initialized axis by default
var currentAxisX = "start_year";
var currentAxisY = "vei";

// The code for the chart is wrapped inside a function that automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and height of the browser window.
    var svgWidth = window.innerWidth * 0.98;
    var svgHeight = window.innerHeight  * 0.33;
    var margin = {top: svgHeight * 0.09, right: svgWidth * 0.05, bottom: svgHeight * 0.2, left: 100};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate("+ margin.left + "," + margin.top +")");

    var chart = svg.append("g");

    d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);
    
    var url = '/database/eruptions'
    d3.json(url, function(error, eruptions) {
        if (error) return console.warn(error);
        // console.log(eruptions.start_year)
        eruptions.forEach(function(d) {
            d.start_year = +d.start_year;
            d.vei = +d.vei;
        });
    
        // Create scale functions
        var yLinearScale = d3.scaleLinear().range([height, 0]);
        var xLinearScale = d3.scaleLinear().range([0, width]);

        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // These variables store the minimum and maximum values in a column in data.csv
        var xMin, xMax, yMin, yMax;

//////////////////////////////////////////////////////////////////
// Min & Max Axis Points
//////////////////////////////////////////////////////////////////

        function findMinMaxXY(dataColumnX, dataColumnY) {
            xMin = d3.min(eruptions, function(d) {
                return(+d[dataColumnX])
            });
            xMax = d3.max(eruptions, function(d) {
                return(+d[dataColumnX])
            });

            yMin = d3.min(eruptions, function(d) {
                return (+d[dataColumnY]) 
            });
            yMax = d3.max(eruptions, function(d) {
                return (+d[dataColumnY])
            });
        }

//////////////////////////////////////////////////////////////////
// ToolTips - Labels Each Scatter Point
//////////////////////////////////////////////////////////////////

        // Create axis lines to match the default data view
        findMinMaxXY(currentAxisX, currentAxisY);
        xLinearScale.domain([xMin, xMax]);
        yLinearScale.domain([0, 8]);  //[yMin, yMax]);

        // tooltip orientation & placement with respect to data points
        var tipH, tipV;

        tipH = 100;
        tipV = 40;

        var stamps;
        var health;
        var diploma;
        var checkup;

        // tooltip function
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([tipV, tipH])
            .html(function(d) {
                var xlabel = +d[currentAxisX];
                var ylabel = +d[currentAxisY];
                var name = d.volcano_name;
                return (name
                    + "<br>Volcanic Explosivity Index(VEI)<span style='color:orange'>" 
                    + ylabel
                    + "%</span><br>Time<span style='color:orange'>" 
                    + xlabel
                    + "%</span>");
            });

        chart.call(toolTip);

//////////////////////////////////////////////////////////////////
// Data Points Plotted
//////////////////////////////////////////////////////////////////
        var scaleQuantRad = d3.scaleQuantile()
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
            .range([2.1, 3, 4, 5, 6, 7, 8, 9, 10]);
        var scaleQuantColor = d3.scaleQuantile()
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
            .range(["#ffeda0", "#fed976", 
            "#feb24c", "#fd8d3c", "#fc4e2a", 
            "#e31a1c", "#bd0026", "#800026"]);

    function plot_points(selection, rescale_null = 1, rescale_val = 1) {
        // Helper function for plotting points.
            selection
                .attr("r", function (d) {
                if (d.vei === null) {
                    return 2.1 / rescale_null;
                }
                else {
                    return scaleQuantRad(d.vei) / rescale_val ;
                }
                })
                .attr('fill', function (d) {
                if (d.vei === null) {
                    return "#ffeda0"
                    }
                    else {
                    return scaleQuantColor(d.vei);
                    }
                })
                }
        feature = chart
            .selectAll("circle")
            .data(eruptions)
            .enter().append("circle")
            .style("opacity", 0.6)
            .attr("cx", function(d) {

                // console.log("x coord: ", d[currentAxisX]);
                return xLinearScale(+d[currentAxisX]);
            })
            .attr("cy", function(d) {

                // console.log("y coord: ", d[currentAxisY]);
                return yLinearScale(+d[currentAxisY]);
            })
            .on("mouseover", function(d) {
                toolTip.show(d);
            })
            // on mouse out event
            .on("mouseout", function(d) {
                toolTip.hide(d);
            });
            
        plot_points(feature)
        // chart.on({
        //     "mouseover": function(d) {
        //         d3.select(this).style("cursor", "pointer"); 
        //     },
        //     "mouseout": function(d) {
        //         d3.select(this).style("cursor", "default"); 
        //     }
        // });


        // Adds bottom axis line to the chart
        chart.append("g")
            .attr("transform", "translate(0,"+ height+")")
            .attr("class", "x-axis")
            .call(bottomAxis);
        
        // Adds x-axis label
        chart.append("text")
            .attr(
                "transform", 
                "translate(" + (width / 2) + " ," + (height + margin.top +20) +")"
            )
            .attr("class", "x-axis-text active")
            .attr("x-data-axis-name", "onStamps")
            .text("Year");

        // Adds y-axis line to the chart
        chart.append("g")
            .attr("class", "y-axis")
            .call(leftAxis).ticks(8);

//////////////////////////////////////////////////////////////////
// Y Axis - Labeling & Placement
//////////////////////////////////////////////////////////////////

        // Adds y-axis label
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + margin.left/4)
            .attr("x", 0 - ( height / (2) ) )
            .attr("dy", "1em")
            .attr("class", "y-axis-text active")
            .attr("y-data-axis-name", "posHealth")
            .text("Volcanic Explosivity Index (VEI)");
    });
}