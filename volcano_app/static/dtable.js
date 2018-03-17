url = "table";
retval = [];
d3.json(url, function(error, response){
	indices = response.index;
	dataResponse = response.data;
	for(i=0; i<indices.length;i++){
		var dataTemp = dataResponse[i];
		var dataPush = [dataTemp[1], dataTemp[2], dataTemp[3], dataTemp[4], dataTemp[5], dataTemp[8]];
		retval.push(dataPush);
		};
	$(document).ready(function() {
    $('#risk').DataTable({
    	data: retval,
    	columns: [
    	{title: "City"},
    	{title: "Latitude"},
    	{title: "Longitude"},
    	{title: "Population"},
    	{title: "Country"},
    	{title: "Risk"}
    	]
    });
} );

	});
console.log(retval); 




//function getTable(){
//	url = "table";
//	retval = [];
//	d3.json(url, function(error, response){
//		indices = response.index;
//		dataResponse = response.data;
//		for(i=0; i<indices.length;i++){
//			var dataTemp = dataResponse[i];
//			var dataPush = [dataTemp[1], dataTemp[2], dataTemp[3], dataTemp[4], dataTemp[5], dataTemp[8]];
//			retval.push(dataPush);
//		};
//	});
//	console.log(retval);
//	return retval;
//};

//var dataSet = getTable();
//console.log(dataSet);





function fillTable(){
	url = "table";
	d3.json(url, function(error, response){
		indices = response.index;
		for(i=0; i<indices.length; i++){
			data_response = response.data[i];
			var $tbody = document.querySelector("tbody");
			var $row = $tbody.insertRow(i);
			//We'll add add the rows by hand

			//City
			var $cell = $row.insertCell(0);
			$cell.innerText = data_response[1];

			//Latitude
			var $cell = $row.insertCell(1);
			$cell.innerText = data_response[2];

			//Longitude
			var $cell = $row.insertCell(2);
			$cell.innerText = data_response[3];

			//Population
			var $cell = $row.insertCell(3);
			$cell.innerText = data_response[4];

			//City
			var $cell = $row.insertCell(4);
			$cell.innerText = data_response[5];

			//Risk
			var $cell = $row.insertCell(5);
			$cell.innerText = data_response[8];



		}
	})
};
//fillTable();

//$(document).ready(function() {
  //  $('#risk').DataTable({
    //	data: retval,
    //	columns: [
    //	{title: "City"},
    //	{title: "Latitude"},
    //	{title: "Longitude"},
    //	{title: "Population"},
    //	{title: "Country"},
    //	{title: "Risk"}
    //	]
    //});
//} );

