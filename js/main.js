var map;
var token;
var airports_simple = [];
var markersVisible = false;
var geojson = [];

var airports_small = [];
var airports_medium = [];
var airports_large = [];
var countries = {};
var airports_count = 0;

var before, after, wasMode, currentMode; // 1 = small, 2 = medium, 3 = large
var zoomLevel = 4;

//When document is ready
$(function() {
	token = L.mapbox.accessToken = "pk.eyJ1IjoiY29ycm9kaXplIiwiYSI6IkN4ZTAtZFUifQ.30pfMZ3Nqd5mJoLIrQ19uQ";
	map = L.mapbox.map("map", "corrodize.j40899hk");

	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			map.setView([position.coords.latitude, position.coords.longitude], 5);
		})
	}

	map.on("click", function() {
		hideStats()
	});

	map.on("zoomend", function() {
		if(map.getZoom() > 5) {
			map.featureLayer.setFilter(function() {
				return true;
			});
		} else {
			map.featureLayer.setFilter(function() {
				return false;
			});
		}
	})

	setupData();

});

//Fills json data into two arrays
function setupData() {
	//load countries json	
	$.getJSON('./res/countries.json', function(data) {
		$.each(data, function (key, res) {
			countries[key] = res;
			hist[key] = 0;
		});
	});
	
	//load airports json
	$.getJSON('./res/airports_withoutheliports.json', function(data) {
		$.each(data, function (key, res) {
			//create airport object
			var data = {
				airport: res,
				marker: {
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: [res.longitude_deg, res.latitude_deg]
					},
					properties: {
						title: res.name,
						description: 
							"<strong>City: </strong>" + res.municipality + "<br>" +
							"<strong>Country: </strong>" + countries[res.iso_country] + "<br>" + 
							"<strong>Elevation: </strong>" + Math.round(res.elevation_ft * 0.3048) + "m<br>" +
							"<strong>IATA Code: </strong>" + res.iata_code + "<br>" +
							"<a href=" + res.wikipedia_link + ">Wikipedia</a><br>" +
							"<a href=" + res.home_link + ">Website</a>",	
						"marker-symbol": "airport"
					}
				}
			}
			
			if(res.type === "small_airport") {
				airports_small[res.id] = data;
			} else if(res.type === "medium_airport") {
				airports_medium[res.id] = data;
			} else {
				airports_large[res.id] = data;
			}
			var autocomplete = "";
				
			if(res.name) autocomplete += res.name;
			if(res.iata_code) autocomplete += " (" + res.iata_code + ")";
			if(res.municipality) autocomplete += ", " + res.municipality;
			if(res.iso_country) autocomplete += ", " + countries[res.iso_country];
		
			airports_simple[res.id] = autocomplete;
		})	
	}).done(function() {
		setMode(3);
		wasMode = null;
		setMarkers();

		$("#search_input").autocomplete({
			source: _.values(airports_simple), //fill autocomplete with values of airports_simple
			minLength: 3,
			select: function( event, ui ) 
					{
						var selected = ui.item.value; //value of selected item
						var airp_id = (_.invert(airports_simple))[selected]; //get id of that airport by inverting hash
						if(airp_id in airports_small) {
		 					panToMarker(airp_id, airports_small);
		 				}
		 				else if (airp_id in airports_medium) {
		 					panToMarker(airp_id, airports_medium);
		 				}
		 				else{
		 					panToMarker(airp_id, airports_large);
		 				}
					}
					
		});
	})
}

function removeMarkers() {
	if(markersVisible == true) {
		map.removeLayer(geojson);
		geojson = [];

		$('#markers_count').html('0');
	}
}

function setMarkers() {
	$("#loader").css("display", "block");
	removeMarkers();

	if(currentMode != wasMode) {
		var airports = getSelectedAirports();

		for(var i in airports) {
			geojson.push(airports[i].marker);
		}

		markersVisible = true;
	}

	airports_count = geojson.length;
	map.featureLayer.setGeoJSON(geojson);

	$('#markers_count').html(airports_count);
	$("#loader").css("display", "none");
}

function setMode(value) {
	wasMode = currentMode;
	currentMode = value;
	$('.modeToggle').removeClass('active');
	if(value == 1) {
		$('#toggle_small').addClass('active');
		$('#airport_feedback').html('Small Airports');
		zoomLevel = 6;
	}
	else if(value == 2) {
		$('#toggle_medium').addClass('active');
		$('#airport_feedback').html('Medium Airports');
		zoomLevel = 5;
	}
	else {
		$('#toggle_large').addClass('active');
		$('#airport_feedback').html('Large Airports');
		zoomLevel = 4;
	}
}

function getSelectedAirports() {
	var data;
	if(currentMode == 1) {
		data = airports_small;
	}
	else if(currentMode == 2){
		data = airports_medium;
	}
	else {
		data = airports_large;
	}
	return data;
}

function panToMarker(airp_id, airports_array) {
	var lati = airports_array[airp_id].marker.geometry.coordinates[0];
	var longi = airports_array[airp_id].marker.geometry.coordinates[1];

	map.panTo(new L.LatLng(longi, lati));
	
	
	airports_count = geojson.length;
	map.featureLayer.setGeoJSON(geojson);

	$('#markers_count').html(airports_count);
	$("#loader").css("display", "none");
 }