function buildPlot(){
	url = "0,";
	Plotly.d3.json(url, function(error, response){
		indices = response.index;
		years = [];
		tempObs = [];
		tempFit = [];
		myFit = [];
		//console.log(response);
		for(j=0; j < indices.length; j++){
			data_response = response.data[j];
			years.push( data_response[0] );
			tempObs.push(data_response[1]);
			tempFit.push(data_response[2]);
			myFit.push(data_response[3]);
		};
		var trace1 = {
			x: years,
			y: tempObs,
			name: "Observed Temperature",
			type: "scatter"
		};
		var trace2 = {
			x: years,
			y: tempFit,
			name: "Berkeley Fit",
			type: "scatter"
		};
		var trace3 = {
			x: years,
			y: myFit,
			name: "Adjusted Fit",
			type: "scatter"
		};
		var data=[trace1, trace2, trace3];

		var layout = {
    	title: 'Global Surface Temperature vs Time',
    	xaxis: {title: "Year"},
    	yaxis: {title: "Temperature(C)", range:[5,10.5]},
    	annotations: [
    	{
     	x: 1783,
     	y: 7.1,
     	xref: 'x',
     	yref: 'y',
     	text: 'Laki',
     	showarrow: true,
     	arrowhead: 3,
     	ax: 0,
     	ay: 40 
    	},
        {
     	x: 1815,
     	y: 6.8,
     	xref: 'x',
     	yref: 'y',
     	text: 'Tambora',
     	showarrow: true,
     	arrowhead: 3,
     	ax: 0,
     	ay: 40 
    	},
        {
     	x: 1835,
     	y: 7.6,
     	xref: 'x',
     	yref: 'y',
     	text: 'Cosiguina',
     	showarrow: true,
     	arrowhead: 3,
     	ax: 0,
     	ay: 40 
    	},
        {
     	x: 1883,
     	y: 8.0,
     	xref: 'x',
     	yref: 'y',
     	text: 'Krakatoa',
     	showarrow: true,
     	arrowhead: 3,
     	ax: 0,
     	ay: 40 
    	},
        {
	     x: 1963,
    	 y: 8.5,
  	   xref: 'x',
  	   yref: 'y',
 	    text: 'Agung',
 	    showarrow: true,
 	    arrowhead: 3,
 	    ax: 0,
 	    ay: 40 
 	   },
        {
  	   x: 1982,
  	   y: 8.8,
  	   xref: 'x',
  	   yref: 'y',
 	    text: 'Chichon',
 	    showarrow: true,
 	    arrowhead: 3,
 	    ax: 0,
 	    ay: 40 
 	   },
        {
  	   x: 1991,
  	   y: 9.0,
 	    xref: 'x',
 	    yref: 'y',
 	    text: 'Pinatubo',
 	    showarrow: true,
 	    arrowhead: 3,
 	    ax: 0,
 	    ay: 40 
 	   }
    ]
   }

   Plotly.newPlot("plot", data, layout);

	});
};
buildPlot();

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

//var myArray = ['1,','2,','3,','4,','5,','6,','7,'];
var myArray = [];
function optionChanged(option){
    if(myArray.includes(option) ){
        myArray.remove( myArray.indexOf(option) );
    }else{
        myArray.push(option);
    };
    url = "0,";
    console.log(myArray);
    for(j=0; j < myArray.length; j++){
        url = url + myArray[j];
        console.log(url);
    };

    Plotly.d3.json(url, function(error, response){
        indices = response.index;
        years = [];
        tempObs = [];
        tempFit = [];
        myFit = [];
        //console.log(response);
        for(j=0; j < indices.length; j++){
            data_response = response.data[j];
            years.push( data_response[0] );
            tempObs.push(data_response[1]);
            tempFit.push(data_response[2]);
            myFit.push(data_response[3]);
        };
        var trace1 = {
            x: years,
            y: tempObs,
            name: "Observed Temperature",
            type: "scatter"
        };
        var trace2 = {
            x: years,
            y: tempFit,
            name: "Berkeley Fit",
            type: "scatter"
        };
        var trace3 = {
            x: years,
            y: myFit,
            name: "Adjusted Fit",
            type: "scatter"
        };
        var data=[trace1, trace2, trace3];

        var layout = {
        title: 'Global Surface Temperature vs Time',
        xaxis: {title: "Year"},
        yaxis: {title: "Temperature(C)", range:[5,10.5]},
        annotations: [
        {
        x: 1783,
        y: 7.1,
        xref: 'x',
        yref: 'y',
        text: 'Laki',
        showarrow: true,
        arrowhead: 3,
        ax: 0,
        ay: 40 
        },
        {
        x: 1815,
        y: 6.8,
        xref: 'x',
        yref: 'y',
        text: 'Tambora',
        showarrow: true,
        arrowhead: 3,
        ax: 0,
        ay: 40 
        },
        {
        x: 1835,
        y: 7.6,
        xref: 'x',
        yref: 'y',
        text: 'Cosiguina',
        showarrow: true,
        arrowhead: 3,
        ax: 0,
        ay: 40 
        },
        {
        x: 1883,
        y: 8.0,
        xref: 'x',
        yref: 'y',
        text: 'Krakatoa',
        showarrow: true,
        arrowhead: 3,
        ax: 0,
        ay: 40 
        },
        {
         x: 1963,
         y: 8.5,
       xref: 'x',
       yref: 'y',
        text: 'Agung',
        showarrow: true,
        arrowhead: 3,
        ax: 0,
        ay: 40 
       },
        {
       x: 1982,
       y: 8.8,
       xref: 'x',
       yref: 'y',
        text: 'Chichon',
        showarrow: true,
        arrowhead: 3,
        ax: 0,
        ay: 40 
       },
        {
       x: 1991,
       y: 9.0,
        xref: 'x',
        yref: 'y',
        text: 'Pinatubo',
        showarrow: true,
        arrowhead: 3,
        ax: 0,
        ay: 40 
       }
    ]
   }

   Plotly.newPlot("plot", data, layout);

    });
};






  



