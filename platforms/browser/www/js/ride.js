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
	
	var getRider = function() {
        var key = "userID";
        var storage = window.localStorage;
        var value = storage.getItem(key);
        return value;
     };
	
	var loadLocations = function( ) {
    	
    	var rideID = $jq( "#ride-uuid" ).attr("data-uuid");
    	
    	var url = locationsURL( rideID );
    	
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
		return getRide( rideURL( uuid ), loadLocations );
	}
	
	var renderRide = function( tbody, result ) {
		
		var html = Mustache.to_html(ridesTemplate, result );
		tbody.html( html );
		
	};
	
	var renderData = function( returned ) {
		
		if ( $jq.isArray( returned ) ) {
			$jq("#long").html( returned[0].longitude );
			$jq("#lat").html( returned[0].lattitude );
			$jq("#moment").html( returned[0].moment );
		}
		else {
			$jq("#long").html( returned.longitude );
			$jq("#lat").html( returned.lattitude );
			$jq("#moment").html( returned.moment );
		}
		
	}
	
	var renderLocation = function( location ) {
		
		$jq("#long").html( location.coords.longitude );
		$jq("#lat").html( location.coords.latitude );
		
	}
	
	var renderLocations = function( locations ) {
		var div = $jq("#vive-locations");
		var locationsTemplate = $jq("#locationsTemplate").html();
		var html = Mustache.to_html( locationsTemplate, locations );
		div.html( html );
			
	};
	
	var ping = function() {
		
		navigator.geolocation.getCurrentPosition( updateLocation, onError);
		
	}
	
	var updateLocation = function( location ) {
		
		var rideUuid = $jq( "#ride-uuid" ).val();
		
		var riderUuid = getRider();
		
		var l
			= new Location( rideUuid, riderUuid, location.coords.latitude, location.coords.longitude );
		
		postLocation( l, renderData );
		
	}
	
	var track = function( ride ) {
		
		renderRide( ride );
		window.setInterval( ping, 10000 );
		
	}
	
	var startRide = function( position ) {
		
		var uuid = $jq( "#ride-uuid" ).val();
		
		var ride 
			= new Ride( uuid, "ROLLIN_IN_THE_DEEP", position.coords.latitude, position.coords.longitude );
	
		putRide( ride, $jq("#ride"), track );
		
		/*
			('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
        */
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
    	$jq("#error").html( error.message );
    	console.error( error );
    }
    
$jq("#ride-start").click( function() {
	
	// navigator.geolocation.getCurrentPosition( renderLocation, onError, { timeout: 20000, enableHighAccuracy: true } );
	navigator.geolocation.getCurrentPosition( startRide, onError, { timeout: 20000, enableHighAccuracy: true } );
	
	
} );
    
jQuery( document ).ready(function() {

    try {
    	var uuid = getParameter(window.location.href,"q");
    	$jq( "#ride-uuid" ).attr("data-uuid", uuid );
    	loadRide( uuid );
	}
	catch( err ) {
		$jq("#error").html( err );
		console.error( err );
	}


});
