var map;

//Arrays holding the airports
var heliports = new Array();
var small_airports = new Array();
var medium_airports  = new Array();
var large_airports  = new Array();

//Array holding the associated Markers
var markers = new Array();

//When document is ready
$(function() {
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 8,
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
				//Create a new entry into the matching array - its id as index
				if(res.type == "heliport") {
					heliports[res.id] = res;
				} else if(res.type == "small_airport") {
					small_airports[res.id] = res;
				} else if(res.type == "medium_airport") {
					medium_airports[res.id] = res;
				} else 
					large_airports[res.id] = res;

				//Create a new markers in the markers array - id of this airport as index
				markers[res.id] = 
					new google.maps.Marker({
						position: new google.maps.LatLng(res.latitude_deg, res.longitude_deg),
						airport_id: res.id,
						map: null
					});

				google.maps.event.addListener(markers[res.id], "click", function() {
					console.log("Click");
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

	var arr;

	if(type == "heliport") arr = heliports;
	else if(type == "small_airport") arr = small_airports;
	else if(type == "medium_airport") arr = medium_airports;
	else arr = large_airports;

	for(var i = 0; i < arr.length; i++) {
		if(arr[i]) markers[arr[i].id].setMap(map);
	} 

	$("#loader").css("display", "none");
}