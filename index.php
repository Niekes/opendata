<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="utf-8">
		<meta lang="en">
		<link rel="stylesheet" href="./css/reset.css">
		<link rel="stylesheet" href="./bootstrap/css/bootstrap.min.css">
		<link rel="stylesheet" href="./css/main.css">
	</head>

	<body>
		<nav class="navbar navbar-default" role="navigation">
   			<div class="navbar-header">
      			<a class="navbar-brand">Airports</a>
   			</div>
  			<div>
	      		<ul class="nav navbar-nav">
				  <li class="dropdown">
				    <a class="dropdown-toggle" data-toggle="dropdown">Settings</a>
				    <ul class="dropdown-menu" id="dropdown">
				    	<li value="heliport" onclick="setMarkers('heliport')">
				    		<a>Heliport</a>
				    	</li>
				    	<li value="small_airport" onclick="setMarkers('small_airport')">
				    		<a>Small Airport</a>
				    	</li>
				    	<li value="medium_airport" onclick="setMarkers('medium_airport')">
				    		<a>Medium Airport</a>
				    	</li>
				    	<li value="large_airport" class="active" onclick="setMarkers('large_airport')">
				    		<a>Large Airport</a>
				    	</li>
				    </ul>
				  </li>
				  <li><a id="loader"><img src="./res/ajax-loader.gif"></a></li>
				</ul>
		   	</div>
		</nav> 
		<section id="map"></section>

		<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyCzieVh2_sb-DScaGGzNCvUddUa3Ys9x8A&libraries=places&sensor=true"></script>
		<script type="text/javascript" src="./js/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="./bootstrap/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="./js/main.js"></script>
	</body>
</html>