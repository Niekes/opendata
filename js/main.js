var map;
var heatmap;
var airports_simple = new Array();
var positions = new Array();
var markersVisible = true;
var iconSmallAirports = new google.maps.MarkerImage('img/small_airports.png');
var iconMediumAirports = new google.maps.MarkerImage('img/medium_airports.png');
var iconBigAirports = new google.maps.MarkerImage('img/big_airports.gif');

var airports_small = [];
var airports_medium = [];
var airports_large = [];

var before;
var after;
var mode = 3;

//Arrays holding the airports
//var airports = new Array();

//Array holding the associated Markers
var markers_small = [];
var markers_medium = [];
var markers_large = [];
//When document is ready
$(function() {
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 7,
		center: new google.maps.LatLng(52,13),
		disableDefaultUI: false
	});

	if(navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
      	var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      	map.setCenter(pos);
    	}, function() {
      		handleNoGeolocation(true);
    	});
  	}else{
    	handleNoGeolocation(false);
  	}

	//Fill arrays
	setupData();

	//Add event listener to the map
	google.maps.event.addListener(map, "zoom_changed", function() {

		if(mode == 1) {
			if(map.getZoom() <= 6 && markersVisible == true) {
				for(var key in markers_small) {
					markers_small[key].setMap(null);
				}
				markersVisible = false;
			}
			else if(map.getZoom() > 6 && markersVisible == false) {
				for(var key in markers_small) {
					markers_small[key].setMap(map);
				}
				markersVisible = true;
			}
		}

		else if(mode == 2) {
			if(map.getZoom() <= 6 && markersVisible == true) {
				for(var key in markers_medium) {
					markers_medium[key].setMap(null);
				}
				markersVisible = false;
			}
			else if(map.getZoom() > 6 && markersVisible == false) {
				for(var key in markers_medium) {
					markers_medium[key].setMap(map);
				}
				markersVisible = true;
			}
		}

		else { // mode = 3
			if(map.getZoom() <= 6 && markersVisible == true) {
				for(var key in markers_large) {
					markers_large[key].setMap(null);
				}
				markersVisible = false;
			}
			else if(map.getZoom() > 6 && markersVisible == false) {
				for(var key in markers_large) {
					markers_large[key].setMap(map);
				}
				markersVisible = true;
			}
		}
		
	});
});

//Fills json data into two arrays
function setupData() {
	before = new Date().getTime();
	console.log("Fetching airports.json");
	$.ajax({
		url: "./res/airports.json",
		type:"GET",
        dataType:"json",
        contentType:"application/json",
		success: function(result) {
			after = new Date().getTime();
			console.log("Fetching took: " + (after - before)  + " ms");
			console.log("Starting to iterate..");
			before = new Date().getTime();
			$.each(result, function (key, res) {
				if(res.type == "small_airport") {
					airports_small[res.id] = res;
					var contentString = createContent(res.id, airports_small);
					markers_small[res.id] = new google.maps.Marker({
						position: 	new google.maps.LatLng(res.latitude_deg, res.longitude_deg),
						airport_id: res.id,
						map: 		null
					});
					google.maps.event.addListener(markers_small[res.id], "click", function() {
					infowindow.open(map, markers_small[res.id]);
					});
					positions[res.id] = new google.maps.LatLng(res.latitude_deg, res.longitude_deg);
					if (res.iata_code != "" && res.type != "heliport" && res.type != "closed"){
					airports_simple[res.id] = res.name + " (" + res.iata_code + "), " + res.municipality + ", " + res.iso_country; // for autocomplete. save id as key.
					}
					else {
						airports_simple[res.id] = res.name + ", " + res.municipality + ", " + res.iso_country; // for autocomplete. save id as key.
					}
				}
				else if(res.type == "medium_airport") {
					airports_medium[res.id] = res;
					var contentString = createContent(res.id, airports_medium);
					markers_medium[res.id] = new google.maps.Marker({
						position: 	new google.maps.LatLng(res.latitude_deg, res.longitude_deg),
						airport_id: res.id,
						map: 		null
					});
					google.maps.event.addListener(markers_medium[res.id], "click", function() {
					infowindow.open(map, markers_medium[res.id]);
					});
					positions[res.id] = new google.maps.LatLng(res.latitude_deg, res.longitude_deg);
					if (res.iata_code != "" && res.type != "heliport" && res.type != "closed"){
					airports_simple[res.id] = res.name + " (" + res.iata_code + "), " + res.municipality + ", " + res.iso_country; // for autocomplete. save id as key.
					}
					else {
						airports_simple[res.id] = res.name + ", " + res.municipality + ", " + res.iso_country; // for autocomplete. save id as key.
					}
				}
				else if(res.type == "large_airport") {
					airports_large[res.id] = res;
					var contentString = createContent(res.id, airports_large);
					markers_large[res.id] = new google.maps.Marker({
						position: 	new google.maps.LatLng(res.latitude_deg, res.longitude_deg),
						airport_id: res.id,
						map: 		null
					});
					google.maps.event.addListener(markers_large[res.id], "click", function() {
					infowindow.open(map, markers_large[res.id]);
					});
					positions[res.id] = new google.maps.LatLng(res.latitude_deg, res.longitude_deg);
					if (res.iata_code != "" && res.type != "heliport" && res.type != "closed"){
					airports_simple[res.id] = res.name + " (" + res.iata_code + "), " + res.municipality + ", " + res.iso_country; // for autocomplete. save id as key.
					}
					else {
						airports_simple[res.id] = res.name + ", " + res.municipality + ", " + res.iso_country; // for autocomplete. save id as key.
					}
				}
				else {
				//do nothing
				}

				var infowindow = new google.maps.InfoWindow({
      				content: contentString,
  				});

			});
			after = new Date().getTime();
			console.log("Iterating done. Took: " + (after - before) + " ms");
		}
	}).done(function() {
		
		setMarkers(airports_large, markers_large);
		setupHeatMap();
		$( "#search_input" ).autocomplete({
			source: _.values(airports_simple), //fill autocomplete with values of airports_simple
			minLength: 3,
			select: function( event, ui ) {
				var selected = ui.item.value; //value of selected item
				var airp_id = (_.invert(airports_simple))[selected]; //get id of that airport by inverting hash
				if(airp_id in airports_small) {
					panToMarker(airp_id, airports_small, markers_small);
				}
				else if (airp_id in airports_medium) {
					panToMarker(airp_id, airports_medium, markers_medium);
				}
				else{
					panToMarker(airp_id, airports_large, markers_large);
				}
			}
		});
	});
};

function setMarkers(airports, markers) {
	before = new Date().getTime();
	$("#loader").css("display", "block");
	for(var i in airports) {
		markers[i].setMap(map);
	}
	$("#loader").css("display", "none");
	after = new Date().getTime();
	console.log("Setting Markers took: " + (after - before) + " ms");

}

function setupHeatMap() {
	before = new Date().getTime();
	heatmap = new google.maps.visualization.HeatmapLayer({
    	data: new google.maps.MVCArray(positions),
    	opacity: 0.8,
    	radius: 15
  	});
	heatmap.setMap(map);
	after = new Date().getTime();
	console.log("Setting up HeatMap. Took: " + (after - before));
}

function createContent(airportId, airports){
	if((airports[airportId].wikipedia_link === "") === true && (airports[airportId].home_link === "") === true){ // Has no links
		return 	'<strong>Airport: </strong>' + airports[airportId].name + '<br>' +
				'<strong>City: </strong>' + airports[airportId].municipality + '<br>' +
				'<strong>Country: </strong>' + airports[airportId].iso_country + '<br>' +
				'<strong>Elevation: </strong>' + (airports[airportId].elevation_ft * 30.48 / 100).toFixed(1) + ' Meter,'+ '&#160;' + airports[airportId].elevation_ft + ' Feet';
	}else if((airports[airportId].wikipedia_link === "") === true && (airports[airportId].home_link === "") === false){ // Has just Website
		return '<strong>Airport: </strong>' + airports[airportId].name + '<br>' +
				'<strong>City: </strong>' + airports[airportId].municipality + '<br>' +
				'<strong>Country: </strong>' + airports[airportId].iso_country + '<br>' +
				'<strong>Elevation: </strong>' + (airports[airportId].elevation_ft * 30.48 / 100).toFixed(1) + ' Meter,'+ '&#160;' + airports[airportId].elevation_ft + ' Feet' + '<br>' +
				'<a target="_blank" href=' + airports[airportId].home_link + '>' + "Website" + '</a>';
	}else if((airports[airportId].wikipedia_link === "") === false && (airports[airportId].home_link === "") === true){ // Has just Wikipedia link
		return '<strong>Airport: </strong>' + airports[airportId].name + '<br>' +
				'<strong>City: </strong>' + airports[airportId].municipality + '<br>' +
				'<strong>Country: </strong>' + airports[airportId].iso_country + '<br>' +
				'<strong>Elevation: </strong>' + (airports[airportId].elevation_ft * 30.48 / 100).toFixed(1) + ' Meter,'+ '&#160;' + airports[airportId].elevation_ft + ' Feet' + '<br>' +
				'<strong>IATA Code: </strong>' + airports[airportId].iata_code + '<br>' +
				'<a target="_blank" href=' + airports[airportId].wikipedia_link + '>' + "Wikipedia Link" + '</a>';
	}else if((airports[airportId].wikipedia_link === "") === false && (airports[airportId].home_link === "") === false){ // Has both links
		return '<strong>Airport: </strong>' + airports[airportId].name + '<br>' +
				'<strong>City: </strong>' + airports[airportId].municipality + '<br>' +
				'<strong>Country: </strong>' + airports[airportId].iso_country + '<br>' +
				'<strong>Elevation: </strong>' + (airports[airportId].elevation_ft * 30.48 / 100).toFixed(1) + ' Meter,'+ '&#160;' + airports[airportId].elevation_ft + ' Feet' + '<br>' +
				'<strong>IATA Code: </strong>' + airports[airportId].iata_code + '<br>' +
				'<a target="_blank" href=' + airports[airportId].home_link + '>' + "Website" + '</a>' + '<br>' +
				'<a target="_blank" href=' + airports[airportId].wikipedia_link + '>' + "Wikipedia Link" + '</a>';
	}
}


function handleNoGeolocation(errorFlag){
	if(errorFlag){
		alert('Error: The Geolocation service failed.');
	}else{
		alert('Error: Your browser doesn\'t support geolocation.');
	}
}

function panToMarker(airp_id, airports_array, markers_array) {
	before = new Date().getTime();
	var lati = airports_array[airp_id].latitude_deg;
	var longi = airports_array[airp_id].longitude_deg;
	var airp_marker = markers_array[airp_id];
	airp_marker.setMap(map); // in case marker isn't visible at the moment
	airp_marker.setAnimation(google.maps.Animation.BOUNCE);
	map.panTo(new google.maps.LatLng(lati, longi));
	after = new Date().getTime();
	console.log("Panning took: " + (after - before) + " ms")
	setTimeout(function(){airp_marker.setAnimation(null)}, 2000);
}
