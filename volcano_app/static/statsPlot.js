url = "statsplot";
Plotly.d3.json(url, function(error, response){
    indices = response.index;
    risk = [];
    kdeFit = [];
    gammaFit = [];
    gaussFit = [];
    console.log(response);
    for(j=0; j<indices.length; j++){
        data_response = response.data[j];
        risk.push(data_response[4]);
        kdeFit.push(data_response[3]);
        gaussFit.push(data_response[2]);
        gammaFit.push(data_response[1]);
    };
    var trace1 = {
        x: risk,
        y: kdeFit,
        name: "KDE",
        type: "scatter",
        marker: {color: "red"}
    };
    var trace2 = {
        x: risk,
        y: gammaFit,
        name: "Gamma Fit",
        type: "scatter",
        marker: {color: "green"}
    };
    var trace3 = {
        x: risk,
        y: gaussFit,
        name: "Normal Fit",
        type: "scatter",
        marker: {color: "orange"}
    };
    var trace4 = {
        x: risk,
        autobinx: false,
        xbins: {
            start: 0.0,
            end: 10.0,
            size: 0.2
        },
        type: "histogram",
        histnorm: "probability density",
        name: "Histogram",
        marker: {
            color: "blue",
            opacity: 0.5
            }
    };
    var data = [trace1, trace2, trace3, trace4];
    var layout = {
        title: "Distribution of Risk Values",
        xaxis: {title: "Risk"},
        yaxis: {range: [0, 0.4]}
    };
    Plotly.newPlot("plot", data, layout);

});










  



