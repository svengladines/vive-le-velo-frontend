var $jq = jQuery.noConflict();
	
var rideURL = function ( uuid ) {
	return url ("/rides/" + uuid );
	
};
	
var getRide = function ( tbody, callback ) {
	
	var uuid
		= currentRide();
	
	if ( uuid == null ) {
		uuid = "x";
		storeRide( uuid );
	}
	
	$jq.ajax( {
		type: "get",
		url: rideURL( uuid ),
		dataType: "json",
	    processData: false,
		success: function( returned ) {
			if ( callback ) {
				callback( tbody, returned );
			}
			else {
				// success( button, statusElement, "Opgeslagen" );
			}
		},
		error: function(  jqXHR, textStatus, errorThrown ) {
			console.log( errorThrown );
		}
	});
	
};

var refreshRide = function () {
	return getRide( $jq("#rides"), renderRide );
};

var rideTemplate = function() {
	return $jq("#rideTemplate").html();
};

var renderRide = function( tbody, result ) {
	
	var html = Mustache.to_html(rideTemplate(), result );
	tbody.html( html );
	
};

var currentRide = function() {
	
    var key = "ride";
    var storage = window.localStorage;
    var value = storage.getItem(key);
    return value;
    
};

var storeRide = function( rideUuid ) {
    var key = "ride";
    var storage = window.localStorage;
    storage.setItem(key, rideUuid );
}

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

jQuery( document ).ready(function() {
    try {
    	refreshRide();
	}
	catch( err ) {
		alert( err );
	}
});
