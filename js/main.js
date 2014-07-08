var map;
var heatmap;
var airports_simple = new Array();
var positions = new Array();

//Arrays holding the airports
var airports = new Array();

//Array holding the associated Markers
var markers = new Array();	

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
    	alert('Doesnt Works');
  	}

	//Fill arrays
	setupData();

	//Add event listener to the map
	google.maps.event.addListener(map, "zoom_changed", function() {
		if(map.getZoom() >= 8) {
			//Change map depending on zoom level
		} 
	});
});

//Fills json data into two arrays
function setupData() {
	$.ajax({
		url: "./res/airports.json",
		type:"GET",
        dataType:"json",
        contentType:"application/json",
		success: function(result) {

			$.each(result, function (key, res) {
				airports[res.id] = res;
				markers[res.id] = 
					new google.maps.Marker({
						position: new google.maps.LatLng(res.latitude_deg, res.longitude_deg),
						airport_id: res.id,
						map: null
					});
				var contentString = createContent(res.id);

				var infowindow = new google.maps.InfoWindow({
      				content: contentString,
  				});

				google.maps.event.addListener(markers[res.id], "click", function() {
					
					infowindow.open(map, markers[res.id]);
					// console.log(airports[this.airport_id]);
				});

				positions[res.id] = new google.maps.LatLng(res.latitude_deg, res.longitude_deg);

				airports_simple[res.id] = res.name + ", " + res.municipality + ", " + res.iso_country; // for autocomplete. save id as key.

			});
		}
	}).done(function() {
		$("#loader").css("display", "none");
		setMarkers('large_airport');
		setupHeatMap();
		$( "#search_input" ).autocomplete({
			source: _.values(airports_simple), //fill autocomplete with values of airports_simple
			minLength: 3,
			select: function( event, ui ) {
				var bla = ui.item.value; //value of selected item
				var airp_id = (_.invert(airports_simple))[bla]; //get id of that airport by inverting hash
				var lati = airports[airp_id].latitude_deg;
				var longi = airports[airp_id].longitude_deg;
				var airp_marker = markers[airp_id];
				airp_marker.setMap(map); // in case marker isn't visible at the moment
				airp_marker.setAnimation(google.maps.Animation.BOUNCE);
				map.panTo(new google.maps.LatLng(lati, longi));
				setTimeout(function(){airp_marker.setAnimation(null)}, 2000);
			}
		});
	});
};

function setMarkers(type) {
	$("#loader").css("display", "block");

	for(var i = 0; i < airports.length; i++) {
		if(airports[i]) {
			if(airports[i].type == type) {
				markers[i].setMap(map);
			} else markers[i].setMap(null);
		} 
	}

	$("#loader").css("display", "none");
}

function setupHeatMap() {
	heatmap = new google.maps.visualization.HeatmapLayer({
    	data: new google.maps.MVCArray(positions)
  	});

	heatmap.setMap(map);
}

function createContent(airportId){
	if((airports[airportId].wikipedia_link === "") === true && (airports[airportId].home_link === "") === true){
		return 	'<strong>Airport: </strong>' + airports[airportId].name + '<br>' +
				'<strong>City: </strong>' + airports[airportId].municipality + '<br>' +
				'<strong>Country: </strong>' + airports[airportId].iso_country + '<br>' +
				'<strong>Elevation: </strong>' + Math.floor((airports[airportId].elevation_ft * 30.48) / 100) + ' Meter,'+ '&#160;' + airports[airportId].elevation_ft + ' Feet';
	}else if((airports[airportId].wikipedia_link === "") === true && (airports[airportId].home_link === "") === false){
		return '<strong>Airport: </strong>' + airports[airportId].name + '<br>' +
				'<strong>City: </strong>' + airports[airportId].municipality + '<br>' +
				'<strong>Country: </strong>' + airports[airportId].iso_country + '<br>' +
				'<strong>Elevation: </strong>' + Math.floor((airports[airportId].elevation_ft * 30.48) / 100) + ' Meter,'+ '&#160;' + airports[airportId].elevation_ft + ' Feet' + '<br>' +
				'<a target="_blank" href=' + airports[airportId].home_link + '>' + "Website" + '</a>';
	}else if((airports[airportId].wikipedia_link === "") === false && (airports[airportId].home_link === "") === true){
		return '<strong>Airport: </strong>' + airports[airportId].name + '<br>' +
				'<strong>City: </strong>' + airports[airportId].municipality + '<br>' +
				'<strong>Country: </strong>' + airports[airportId].iso_country + '<br>' +
				'<strong>Elevation: </strong>' + Math.floor((airports[airportId].elevation_ft * 30.48) / 100) + ' Meter,'+ '&#160;' + airports[airportId].elevation_ft + ' Feet' + '<br>' +
				'<a target="_blank" href=' + airports[airportId].wikipedia_link + '>' + "Wikipedia Link" + '</a>';
	}else if((airports[airportId].wikipedia_link === "") === false && (airports[airportId].home_link === "") === false){
		return '<strong>Airport: </strong>' + airports[airportId].name + '<br>' +
				'<strong>City: </strong>' + airports[airportId].municipality + '<br>' +
				'<strong>Country: </strong>' + airports[airportId].iso_country + '<br>' +
				'<strong>Elevation: </strong>' + Math.floor((airports[airportId].elevation_ft * 30.48) / 100) + ' Meter,'+ '&#160;' + airports[airportId].elevation_ft + ' Feet' + '<br>' +
				'<a target="_blank" href=' + airports[airportId].home_link + '>' + "Website" + '</a>' + '<br>' +
				'<a target="_blank" href=' + airports[airportId].wikipedia_link + '>' + "Wikipedia Link" + '</a>';
	}
}