var initLat = 52.523;
var initLng = 13.411;

//When the document is ready
$(function()
{
	//Load a new instance of google map
	var map = new google.maps.Map(document.getElementById("map"), {
		zoom: 12,
		center: new google.maps.LatLng(initLat, initLng),
		disableDefaultUI: true
	});
});