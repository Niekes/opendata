var data;
var statsName;
var hist = [];
var clicked = false;

function getStatistics() {
	if(clicked) return;
	
	$("#stats").css("display", "block");
	
	switch(currentMode) {
	case 1:
		data = airports_small;
		statsName = "all Small Airports:";
		break;
		
	case 2:
		data = airports_medium;
		statsName = "all Medium Airports:";
		break;
		
	case 3:
		data = airports_large;
		statsName = "all Large Airports:";
		break;
	}
	
	var iataCount = 0;
	var avg_height = 0;
	
	for(var i = 0; i < data.length; i++) {
		if(data[i]) {
			if(data[i].iata_code) iataCount++;
			avg_height += data[i].elevation_ft;
		}
	}
	
	avg_height = (avg_height / airports_count) * 0.305;
	
	$("#statsName").html("Statistics for " + statsName);
	$("#statsContainer").append("<li>Airports counted worldwide: \n" + airports_count + "</li>");
	$("#statsContainer").append("<li>Airports with IATA codes: \n" + iataCount + "</li>");
	$("#statsContainer").append("<li>Average height above sea level: \n" + Math.round(avg_height) + "m</li>");
	
	clicked = true;
}

function hideStats() {
	$("#stats").css("display", "none");
	$("#statsName").html("");
	$("#statsContainer").html("");
	
	clicked = false;
}