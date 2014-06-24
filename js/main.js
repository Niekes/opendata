var map;

//Arrays holding the airports
var airports = new Array();

//Array holding the associated Markers
var markers = new Array();

//When document is ready
$(function() {
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 5,
		center: new google.maps.LatLng(52,13),
		disableDefaultUI: true
	});

	//Fill arrays
	setupData();

	//Add event listener to the map
	google.maps.event.addListener(map, "zoom_changed", function() {
		if(map.getZoom() >= 8) {
			
		} 
	});

});

//Fills json data into two arrays
function setupData() {
	$.ajax({
		url: "./res/airports.json",
		success: function(result) {
			//For each airport...
			$.each(result, function(key, res) {
				airports[res.id] = res;
				//Create a new markers in the markers array - id of this airport as index
				markers[res.id] = 
					new google.maps.Marker({
						position: new google.maps.LatLng(res.latitude_deg, res.longitude_deg),
						airport_id: res.id,
						map: null
					});

				google.maps.event.addListener(markers[res.id], "click", function() {
					console.log(airports[this.airport_id]);
				});

			});
		}
	}).done(function() {
		$("#loader").css("display", "none");
		setMarkers("large_airport");
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