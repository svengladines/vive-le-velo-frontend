var trackTimer;
var status;


jQuery( document ).ready(function() {
	
	document.addEventListener('deviceready', function () {
		
		if ( ! cordova.plugins.backgroundMode.isEnabled() ) {
			
			cordova.plugins.backgroundMode.enable();
			
		}
			
	}, false );
	
	var rideTemplate = $jq("#rideTemplate").html();
	var statusTemplate = "<div>#{{length}}</div>";
	
	var getRider = function() {
        var key = "userID";
        var storage = window.localStorage;
        var value = storage.getItem(key);
        return value;
     };
     
     var rideURL = function ( uuid ) {
    		
    		return url( "/rides/" + uuid );
    		
    };
	
	var ridesURL = function () {
		
		return url( "/rides?today=true" );
		
	};
	
	var locationsURL = function ( uuid ) {
		
		var u = "";
		
		if ( uuid ) {
			u = url ( "/locations?rideID=" + uuid ); 
		}
		else {
			u = url ( "/locations") ;
		}
		
		return u;
		
	};
	
	var postRide = function ( ride, callback ) {
		
		var rides = [ ride ];

		$jq.ajax( {
			type: "post",
			url: ridesURL(),
			dataType: "json",
			contentType: "application/json;charset=\"utf-8\"",
		    processData: false,
			data: JSON.stringify( rides ),
			success: function( returned ) {
				if ( callback ) {
					callback( );
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
	
	var refresh= function () {
		return getRides( ridesURL(), $jq("#ride"), renderRide );
	}
	
	var renderRide = function( div, result ) {
		
		if ( 'OK' === result.value ) {
			
			var rides 
				= result.object;
			
			if ( rides.length == 0 ) {
				
				$jq( "#none" ).removeClass("hidden").addClass("show");
				
				$jq( "#actions-none" ).removeClass("hidden").addClass("show");
				
			}
			else if ( rides.length >= 1 ) {
				
				var rideResult = rides[ 0 ];
				
				var ride = rideResult.object;
				
				$jq( "#ride-uuid" ).attr("data-uuid", ride.uuid );
				
				var html = Mustache.to_html( rideTemplate, ride );
				div.html( html );
				
				if ( ( null == ride.status ) || ( "READY_TO_ROLL" == ride.status ) ) {
					$jq( "#actions-one" ).removeClass("hidden").addClass("show");
				}
				else if ( "ROLLIN_IN_THE_DEEP" == ride.status ) {
					$jq( "#actions-play" ).removeClass("hidden").addClass("show");
				}
				else if ( "PAUZED" == ride.status ) {
					$jq( "#actions-pauze" ).removeClass("hidden").addClass("show");
				}
				else if ( "FINITO" == ride.status ) {
					$jq( "#actions-finish" ).removeClass("hidden").addClass("show");
				}
			}
			
		}
		
	};
	
var renderStatus = function( locations ) {
	var div = $jq("#status");
	var html = Mustache.to_html( statusTemplate, locations );
	div.html( html );
		
};
	
	$jq("#join").click( function() {
		 
		var rideUuid 
			= $jq( "#ride-uuid" ).attr( "data-uuid" );
		
		var ride
			= new Ride( rideUuid, "ROLLIN_IN_THE_DEEP" );
		
		var url 
			= rideURL( rideUuid );
	
		putRide( url, ride,  $jq("#ride"), track );
		
	} );
	
	$jq("#event").click( function() {
		
		$jq( ".actions" ).removeClass("show").addClass("hidden");
		$jq( "#commentary" ).removeClass("show").addClass("hidden");
		$jq( "#event" ).removeClass("hidden").addClass("show");
		 
	} );
	
	$jq("#unjoin").click( function() {
		 
		var rideUuid 
			= $jq( "#ride-uuid" ).attr( "data-uuid" );
		
		var ride
			= new Ride( rideUuid, "FINITO" );
		
		var url 
			= rideURL( rideUuid );
		
		untrack();

		putRide( url, ride,  $jq("#ride"), refreshPage );
		
	} );
	
	$jq(".btn-comment").click( function() {
		 
		$jq( ".actions" ).removeClass("show").addClass("hidden");
		$jq( "#commentary" ).removeClass("hidden").addClass("show");
		
	} );
	
	$jq("#whisper").click( function() {
		
		var rideUuid 
			= $jq( "#ride-uuid" ).attr( "data-uuid" );
		
		var ride
			= new Ride( rideUuid, "PAUZED" );
		
		var url 
			= rideURL( rideUuid );
		
		untrack();

		putRide( url, ride,  $jq("#ride"), whisper );
		
	} );
	
	$jq("#talk").click( function() {
		 
		navigator.geolocation.getCurrentPosition( talk, onError);
		
	} );
	
	var whisper = function() {
		 
		navigator.geolocation.getCurrentPosition( talk, onError);
		
	};
	
	var talk = function( location ) {
		
		var rideUuid 
			= $jq( "#ride-uuid" ).attr( "data-uuid" );
		
		var riderUuid 
			= getRider();
		
		var l
			= new Location( rideUuid, riderUuid, location.coords.latitude, location.coords.longitude );
		
		l.comment = $jq("#ze-comment").val();
		l.event = $jq('input[name=ze-event]:checked').val();
		
		postLocation( l, refreshPage );
		
	};
	
	var createRide = function(position) {
		
		var ride 
			= new Ride( null, null, position.coords.latitude, position.coords.longitude );
	
		postRide( ride, refresh );
		
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
    
    var ping = function() {
		
		navigator.geolocation.getCurrentPosition( pong, onError);
		
	}
    
    var loadLocations = function( ) {
    	
    	var rideID = $jq( "#ride-uuid" ).attr("data-uuid");
    	
    	var url = locationsURL( rideID );
    	
    	getLocations( url, renderStatus );
    	
    };
	
	var pong = function( location ) {
		
		var rideUuid = $jq( "#ride-uuid" ).attr("data-uuid");
		
		var riderUuid = getRider();
		
		var l
			= new Location( rideUuid, riderUuid, location.coords.latitude, location.coords.longitude );
		
		postLocation( l, loadLocations );
		
	}
	
	var track = function( ) {
		
		trackTimer = window.setInterval( ping, 10000 );
		
	}
	
	var untrack = function( ) {
		
		window.clearInterval( trackTimer  );
		
		
	}
    
    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    
    var refreshPage = function() {
    	window.location.reload();
    };

    try {
    	refresh();
	}
	catch( err ) {
		console.error( err );
		$jq( "#feedback" ).html( err );
	}

	
});
