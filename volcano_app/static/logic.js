// //Project 02 - Volcanoes
// //Brett Brandom, Joshua Bui, Jonathan Orozco, Caitlyn Ta


// // Function to determine circle radius based on magnitude
// function markerSize(magnitude){
//     return magnitude * 10;
// }


// // Function to determine marker color based on magnitude
// function markerColor(magnitude){
//     if (magnitude <1) {
//         return("#A7226E");
//     }
//     else if (magnitude <2){
//         return ("#EC2049");
//     } 
//     else if (magnitude <3){
//         return ("#F26B38");
//     }
//     else if (magnitude <4){
//         return ("#F7DB4F");
//     }
//     else if (magnitude <5) {
//         return ("#2F9599");
//     }
//     else {
//         return ("#547980");
//     }
// }



// // Setup base map variables
// var accessToken = "pk.eyJ1IjoiY2FpdGxudCIsImEiOiJjamU2aTF0emowMGllMndtejJveXAybHM3In0.zpx3Q-9zHCVMj56sVqgVKw";

// var mapBoxURL = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
// var idStreets = "mapbox.streets";
// var idDark = "mapbox.dark";
// var idPencil = "mapbox.pencil";
// var attribution ='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';

// var streets = L.tileLayer(mapBoxURL, {id: idStreets, attribution: attribution, accessToken: accessToken});
// var dark = L.tileLayer(mapBoxURL, {id: idDark, attribution: attribution, accessToken: accessToken});
// var pencil = L.tileLayer(mapBoxURL, {id: idPencil, attribution: attribution, accessToken: accessToken});


// // Creating map object - center of map is UCI
// var map = L.map("map", {
//     center: [33.942466, -117.229672],
//     zoom: 6,
//     layers: [streets]
// });

// var baseMaps = {
//     "Streets": streets,
//     "Dark": dark,
//     "Pencil": pencil
// };

// var quakes = L.layerGroup([]);
// var plates = L.layerGroup([]);

// var overlayMaps = {
//     "Quakes": quakes,
//     "Plates": plates
// };


// // Load Past 7 Days - All Earthquakes
// var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// // Grabbing our GeoJSON data..
// d3.json(link, function(data) {
    
    
//     for (var i=0; i < data.features.length; i++){
//         	L.geoJson(data.features[i], {
//                 // We turn each feature into a circleMarker on the map.
//                 pointToLayer: function(feature, latlng) {
//                     return L.circleMarker(latlng);
//                 },
//                 // We set the style for each circleMarker using our styleInfo function.
//                 style: function(feature){
//                     return {fillOpacity: .5,
//                             color:0,
//                             weight:0,
// 		    		        fillColor: markerColor(feature.properties.mag),
// 		    		        radius: markerSize(feature.properties.mag)};
//                 },
//                 // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
//                 onEachFeature: function(feature, layer) {
//                     layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
//                 }
//             }).addTo(quakes);
//     }
// });
        

// // Marker for UCI - Data Analytics
// var cone = L.marker([33.640495, -117.844296], {
//  	draggable: true,
//  	title: "UCI"
// }).addTo(map);


//  //Binding a pop-up to our marker
// cone.bindPopup("Data Analytics");


// // Add legend to map
// var legend = L.control({position: 'topleft'});

// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 1, 2, 3, 4, 5],
//         labels = [];
    
//     div.innerHTML += '<b>Magnitude</b><br>';

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < grades.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + markerColor(grades[i]) + '"></i> ' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//     }

//     return div;
// };

// legend.addTo(map);


// // Fetch and render tectonic plate boundries on map

// var link = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
// //var link = "PB2002_plates.json";

// var results=d3.json(link);

// d3.json(link, function(data) {
    
//     for (var plate=0; plate < data.features.length; plate++){
        
//         for (var coordinate=0; coordinate < (data.features[plate].geometry.coordinates.length); coordinate++){
 
//             fromCoords = data.features[plate].geometry.coordinates[coordinate];
//             toCoords = data.features[plate].geometry.coordinates[coordinate +1];

//         	L.geoJson(data.features[plate], {
//                 pointToLayer: function(fromCoords, toCoords) {
//                     return L.polyline(fromCoords, toCoords, { className: 'my_polyline'});
//                 },
//                 // We set the style for each circleMarker using our styleInfo function.
//                 style: function(feature){
//                     return {color: "#8D5524",
//                             weight: 2,
//                            fillOpacity: 0};
//                 }
//             }).addTo(plates);
//         }
//     }
// });

// L.control.layers(baseMaps,overlayMaps,{collapsed:false}).addTo(map);

// map.addLayer(plates);
// map.addLayer(quakes);
