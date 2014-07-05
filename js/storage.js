var database;
var version = 1;

function buildDatabase(data) {
	//Check for IDB support
	if("indexedDB" in window) {}
	else {
		alert("IDB unsupported. Features limited.");
		return;
	}
		
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

//TODO Return-Objekt erhalten - bei return undefined 
function requestAirportByID(id) {
	var transaction = database.transaction(["airports"], "readonly");
	transaction.objectStore("airports").get(id).onsuccess = function(e) {
		console.log(this.result);
	}
}

function getAirportsByType(type) {
	//var transaction = database.transaction(["airports"], "readonly");
	//var objStore = transaction.objectStore("airports");
	//var cursor = objStore.openCursor();
	//var keyrange;
}

function getMarker(id) {
	var transaction = database.transaction(["markers"], "readonly");
	transaction.objectStore("markers").get(id).onsuccess = function(e) {
		console.log(this.result);
	}
}