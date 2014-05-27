var userPos;
const initLat = 52.523;
const initLng = 13.411;

//When document is ready
$(function()
{
	//If geolocation is enabled set user position
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
            userPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            	//Load a new instance of google map
			var map = new google.maps.Map(document.getElementById("map"), {
				zoom: 12,
				center: userPos,
				disableDefaultUI: true
			});
		});
	}
});