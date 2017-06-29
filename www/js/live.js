var $jq = jQuery.noConflict();

var getParameter = function (url, key) {
			var urlParts = url.split('?');
		    var sURLVariables = urlParts[1].split('&');
		    for (var i = 0; i < sURLVariables.length; i++) 
		    {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == key) 
			{
			    return sParameterName[1];
			}
		    }
};

var renderMap = function( locations ) {
		var mostRecentLocation = locations[ 0 ];
		var map = L.map('vive-map').setView([mostRecentLocation.lattitude,mostRecentLocation.longitude], 13);
		L.marker([mostRecentLocation.lattitude,mostRecentLocation.longitude]).addTo(map);
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
}

var loadMap = function( uuid ) {

	var url = locationsURL( uuid );
	getLocations( url, renderMap );
		
};

jQuery( document ).ready(function() {
	
	try {
		var uuid = getParameter(window.location.href,"q");
		loadMap( uuid );
	}
	catch( err ) {
		console.error( err );
		alert("error");
	}
});
