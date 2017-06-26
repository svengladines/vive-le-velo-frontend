var $jq = jQuery.noConflict();
var tracker = null;

var rideID = function () {

    	return $jq( "#ride-uuid" ).attr("data-uuid");

};

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
	
	var getRider = function() {
        var key = "userID";
        var storage = window.localStorage;
        var value = storage.getItem(key);
        return value;
     };
	
var loadLocations = function( ) {
    	
	var url = locationsURL( rideID() );
    	
	getLocations( url, renderLocations );
    	
};
	
var postLocation = function ( location, callback ) {
	
	var locations = [ location ];

	$jq.ajax( {
		type: "post",
		url: locationsURL(),
		dataType: "json",
		contentType: "application/json;charset=\"utf-8\"",
	    processData: false,
		data: JSON.stringify( locations ),
		success: function( returned ) {
			if ( callback ) {
				callback( returned );
			}
			else {
				// success( button, statusElement, "Opgeslagen" );
			}
		},
		error: function(  jqXHR, textStatus, errorThrown ) {
			$jq("#error").html( errorThrown );
		}
	});
	
};
	
	var loadRide = function ( uuid ) {
		var callbacks = { renderData, loadLocations };
		return getRide( rideURL( uuid ), callbacks );
	}
	
	var renderLocation = function( location ) {
		
		$jq("#long").html( location.coords.longitude );
		$jq("#lat").html( location.coords.latitude );
		
	}

// ### rendering

var renderData = function( ride ) {
	
	var dataDiv = $jq("#vive-data");
	var dataTemplate = $jq("#dataTemplate").html();
	var html = Mustache.to_html( dataTemplate, ride );
	dataDiv.html( html );
	
	// after rendering, bind events
	
	$jq("#vive-ride-title").keypress( function( e ) {
	    
		if(e.which == 13) {
			
			var newTitle = $jq("#vive-ride-title").val();
			var ride = new Ride();
			ride.uuid = rideID();
			ride.title = newTitle;
			putRide( rideURL( ride.uuid ), ride );
	        
	    }
	})
			
};
	
var renderLocations = function( locations ) {
	var l = { locations: locations, last:locations[locations.length-1] };
	var locationsDiv = $jq("#vive-locations");
	var locationsTemplate = $jq("#locationsTemplate").html();
	var html = Mustache.to_html( locationsTemplate, l );
	locationsDiv.html( html );
			
};
	
var ping = function() {
		
	navigator.geolocation.getCurrentPosition( updateLocation, onError, { timeout: 20000, enableHighAccuracy: true } );
		
};
	
var updateLocation = function( position ) {
		
	var rideUuid = rideID();
		
	var riderUuid = getRider();
		
	var l
		= new Location( rideUuid, riderUuid, position.coords.latitude, position.coords.longitude );
		
	postLocation( l, loadLocations );
		
}
	
var track = function( ) {
	
	if ( tracker == null ) {
		
		tracker = window.setInterval( ping, 10000 );
		
	}
		
};

var untrack = function( ) {
		
	window.clearInterval( tracker  );
	tracker = null;
	cordova.plugins.backgroundMode.disable();
		
};
	
var join = function( position ) {
		
	// join ride by start tracking
	track( );
		
};

var unjoin = function( position ) {
	
	// stop tracking
	untrack( );
		
};

// onError Callback receives a PositionError object
//
function onError(error) {
	$jq("#error").html( error.message );
	console.error( error );
};
    
jQuery( document ).ready(function() {
	
	try {
		
		document.addEventListener('deviceready', function () {
			
			if ( ! cordova.plugins.backgroundMode.isEnabled() ) {
				
				cordova.plugins.backgroundMode.enable();
				
			}
				
		}, false );
		
		$jq("#join").click( function() {
	    	
	    	join();
		
		
		} );
		
		$jq("#unjoin").click( function() {
	    	
	    	unjoin();
		
		
		} );
		
		var uuid = getParameter(window.location.href,"q");
	    $jq( "#ride-uuid" ).attr("data-uuid", uuid );
	    loadRide( uuid );
	    
	}
	catch( err ) {
		$jq("#error").html( err );
		console.error( err );
	}


});
