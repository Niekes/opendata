var userPos;
var map;
var lats = [52.53064, 52.51592, 52.45000, 52.55000, 52.53330, 52.51670, 52.53611];
var lngs = [13.38307, 13.45457, 13.56670, 13.55000, 13.16670, 13.30000, 13.60497];

//When document is ready
$(function()
{
	//If geolocation is enabled set user position
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
            userPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            	//Load a new instance of google map
			map = new google.maps.Map(document.getElementById("map"), {
				zoom: 13,
				center: userPos,
				disableDefaultUI: true
			});

			new google.maps.Marker({
				position: userPos,
				map: map,
				title: "Your position"
			})
		});
	}
});

function centerMap(obj) {
	var options = $(obj).find("option");
	for(var i = 0; i < options.length; i++) {
		if(options[i].selected) {
			map.panTo(new google.maps.LatLng(lats[i], lngs[i]));
			break;
		}
	}
}