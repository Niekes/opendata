var map;
var heatmap;
var positions = new Array();

//Arrays holding the airports
var airports = new Array();

//Array holding the associated Markers
var markers = new Array();

//When document is ready
$(function() {
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 3,
		center: new google.maps.LatLng(52,13), // Hier macht Stefan das mit der GeoLocation
		disableDefaultUI: false
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
		"type":"GET",
        "dataType":"json",
        "contentType":"application/json",
		success: function(result) {

			console.log(result[0]);


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

			});
		}
	}).done(function() {
		$("#loader").css("display", "none");
		setMarkers('large_airport');
		setupHeatMap();
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