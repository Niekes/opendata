var database;
var version = 1;

function buildDatabase(data) {
	//Check for IDB support
	if("indexedDB" in window) {}
	else {
		alert("IDB unsupported. Features limited.");
		return;
	}
	
	localStorage.setItem("airport", null);
	localStorage.setItem("marker", null);
	
	var request = indexedDB.open("airports", version);
	
	request.onupgradeneeded = function(e) {
		console.log("Setting up stores...");
		
		var db = e.target.result;
	
		if(!db.objectStoreNames.contains("airports")) {
			db.createObjectStore("airports").createIndex("type", "type");
		}
		
		if(!db.objectStoreNames.contains("markers")) {
			db.createObjectStore("markers");
		}

		console.log("Done.");
	}

	request.onsuccess = function(e) {
		database = e.target.result;
		
		if(sessionStorage.getItem("loaded") == null){
			var transaction = 
				database.transaction(["airports", "markers"], "readwrite");
			
			$.each(data, function(key, res) {
				transaction.objectStore("airports").add(res, res.id);
			})	
		}
		
		sessionStorage.setItem("loaded", true);
		
		console.log("Ready.");
	}
	
	request.onerror = function(e) {
		alert("Error while loading. See Console.");
		console.log(e);
	}
}

//Saves the requested airport in localstorage and creates the associated marker
function getAirportByID(id) {
	var transaction = database.transaction(["airports"], "readonly");
	transaction.objectStore("airports").get(id).onsuccess = function(e) {
		//localStorage.setItem("airport", JSON.stringify(this.result));
		setMarker(this.result);
	}
}

//Create a marker on the map for each airport when the keyword equals the type of a airport
function getAirportsByType(type) {
	var objStore = database.transaction(["airports"], "readonly").objectStore("airports");
	var index = objStore.index("type");
	
	index.openKeyCursor(type).onsuccess = function(e) {
		var cursor = event.target.result;
		if(cursor) {
			getAirportByID(cursor.primaryKey);
			cursor.continue();
		}
	}
}

function getMarkerByID(id) {
	var transaction = database.transaction(["markers"], "readonly");
	transaction.objectStore("markers").get(id).onsuccess = function(e) {
		localStorage.setItem("marker", JSON.stringify(this.result));
	}
}

function setMarker(airport) {
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(airport.latitude_deg, airport.longitude_deg),
		map: map
	})
	
	//new google.maps.event.addListener(marker, "click", function() {
		
	//})
	
	//localStorage.setItem(count, marker);
}

function storeData(id) {
	var transaction = database.transaction(["markers"], "readwrite");
	transaction.objectStore("markers").add(localStorage.setItem("marker", marker), airport.id);
}