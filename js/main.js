var map;
var data = new Array();

//When document is ready
$(function() {
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 5,
		center: new google.maps.LatLng(52,14),
		disableDefaultUI: true
	});

	setupData();
});

function setupData() {
	$.ajax({
		url: "./res/airports.json",
		success: function(result) {
			$.each(result, function(key, res) {
				data.push(res);
			})
		}
	}).done(function() {
		$("#loader").css("display", "none");
		setMarkers("large_airport");
	})
}

function setMarkers(filterType) {
	$("#loader").css("display", "block");

	$.each(data, function(key, res) {
		if(res.type == filterType) {
			//console.log(res);
			new google.maps.Marker({
				position: new google.maps.LatLng(res.latitude_deg, res.longitude_deg),
				map: map
			})
		}
	})

	$("#loader").css("display", "none");
}