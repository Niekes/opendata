var map;
var heatmap;
var positions = new Array();

//When document is ready
$(function() {
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 7,
		center: new google.maps.LatLng(0,0),
		disableDefaultUI: false
	});

	if(navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
      		map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    	}); 
	} else console.log('Doesnt Works');
	
	//Create markers when map is ready
	google.maps.event.addListenerOnce(map, "tilesloaded", function() {
		$("#loader").css("display", "none");
		getAirportsByType("large_airport");
	});
	
	//Create new database
	setupData();

	/*Add event listener to the map
	google.maps.event.addListener(map, "zoom_changed", function() {
		if(map.getZoom() >= 8) {
			//Change map depending on zoom level
		} 
	});*/
});

//Fills json data into two arrays
function setupData() {
	$.ajax({
		url: "./res/airports.json",
		"type":"GET",
        "dataType":"json",
        "contentType":"application/json",
		success: function(result) {
			buildDatabase(result);
		}
	})
};

function setupHeatMap() {
	heatmap = new google.maps.visualization.HeatmapLayer({
    	data: new google.maps.MVCArray(positions)
  	});

	heatmap.setMap(map);
}