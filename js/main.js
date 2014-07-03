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
		center: new google.maps.LatLng(52,13), // Hier macht Stefan das mit der GeoLocation
		disableDefaultUI: false
	});

	if(navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
      	var pos = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);

      // 	var infowindow = new google.maps.InfoWindow({
      //   map: map,
      //   position: pos,
      //   content: 'Du bist hier'
      // });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
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

				google.maps.event.addListener(markers[res.id], "click", function() {
					console.log(airports[this.airport_id]);

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