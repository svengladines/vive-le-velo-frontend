jQuery( document ).ready(function() {
	
	var $jq = jQuery.noConflict();
	
	var storeActor = function( userID ) {
	    var key = "userID";
		var storage = window.localStorage;
		storage.setItem(key, userID );
	}
	
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
	
	var getRides = function ( tbody, callback ) {
		
		$jq.ajax( {
			type: "get",
			url: ridesURL(),
			dataType: "json",
		    processData: false,
			data: JSON.stringify( rides ),
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
	
	var refreshRides = function () {
		return getRides( $jq("#rides"), renderRides );
	}
	
	var ridesTemplate = $jq("#ridesTemplate").html();
	
	var renderRides = function( tbody, result ) {
		
		var html = Mustache.to_html(ridesTemplate, result );
		tbody.html( html );
		
		loadMaps();
		
	};

	var renderMap = function( locations ) {
		var mostRecentLocation = locations[ 0 ];
		var map = L.map('vive-map-id-' + mostRecentLocation.rideID ).setView([mostRecentLocation.lattitude,mostRecentLocation.longitude], 13);
		L.marker([mostRecentLocation.lattitude,mostRecentLocation.longitude]).addTo(map);
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	}

	var loadMaps = function( ) {

		$jq(".vive-map").each( function() {

			var rideID = $jq(this).attr("data-ride-uuid");
			var url = locationsURL( rideID );
			getLocations( url, renderMap );

		} );

		
	};
	
	$jq("#add").click( function() {
		 
		navigator.geolocation.getCurrentPosition( createRide, onError);
		
	} );
	
	var createRide = function(position) {
		
		var ride 
			= new Ride( null, null, position.coords.latitude, position.coords.longitude );
	
		postRide( ride, refreshRides );
		
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
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    try {
    	refreshRides();
	}
	catch( err ) {
		alert("error");
	}

	
});
