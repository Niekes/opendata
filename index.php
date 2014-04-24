<!DOCTYPE html>
<html>
  <head>
    <title>Open Data</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <style>
      html, body, #map_canvas {
        margin: 0;
        padding: 0;
       
      }	  
	  #map_canvas {
        margin: 50px auto;
        padding: 0;
        height: 700px;
		width:950px;		
      }
    </style>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
    <script>
      var map;

	  
  	function initialize() {
		var geocoder = new google.maps.Geocoder(); // Geocoder braucht man, um Adressen einzugeben
        var mapOptions = {
          zoom: 11, // Zoomlevel
          center: new google.maps.LatLng(52.520007,13.404954), // Kartenmittelpunkt
          mapTypeId: google.maps.MapTypeId.TERRAIN // zeigt physische Kartenkacheln, die auf Geländeinformationen basieren
        };
        map = new google.maps.Map(document.getElementById('map_canvas'),
            mapOptions);			
		
		<?php
				
			$url='https://docs.google.com/spreadsheet/pub?key=0Aok51X-ckHMXdFBRNXg2bDBadXpSc25NWE9RREhTRUE&single=true&gid=0&output=csv';
			$lines=file($url); // liest Datei in das Array $lines
			array_shift($lines); // Überschriften in der Tabelle werden ignoriert

			foreach($lines AS $line){
				list($ort, $info, $adresse, $lat, $lon, $timestamp)=explode(',',$line);
				
				if($lat!='' AND $lon!='' ){ // Wenn kein Längengrad und Breitengrad angegeben wird, nehm die Adresse
					$lon=trim($lon); // mögliche Zeilenumbrüche werden weggeschnitten
					echo "koordinaten($lat,$lon,'$info');\n";
				}else{
					echo "adresse('$adresse','$info');\n";
				}
			}
		?>
		
		function koordinaten(lat,lon,info){
				var marker = new google.maps.Marker({
					map: map,
					position:new google.maps.LatLng(lat,lon)
				});
				var infowindow = new google.maps.InfoWindow({
					content: info
				});
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(marker.get('map'), marker);
				});
		}
		
		function adresse(ort,info){
			geocoder.geocode( { 'address': ort}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {

					var marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location
					});

					google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(marker.get('map'), marker);
					});
						

					var infowindow = new google.maps.InfoWindow({
						content: info
					});
				} else {
					alert('Geocode for ' +  ort + ' was not successful for the following reason: ' + status);
				}
			});  
		}
	
  	}
  	google.maps.event.addDomListener(window, 'load', initialize);
    </script>
	</head>
  	<body>
    	<div id="map_canvas"></div>
  </body>
</html>
