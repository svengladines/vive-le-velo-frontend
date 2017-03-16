var $jq = jQuery.noConflict();

var storeActor = function( userID ) {
        var key = "userID";
	var storage = window.localStorage;
	storage.setItem(key, userID );
}

jQuery( document ).ready(function() {
	
	var Coordinate = function( latitude, longitude ) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
	
	var Ride = function ( latitude, longitude ) {
		this.start = new Coordinate( latitude, longitude );
	};

	var ridesURL = function () {
		
		return "http://localhost:8067/api/rides";
		
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
	
	var ridesTemplate = "{{#object}}<tr><td>{{object.title}}</td><td>{{object.start.latitude}}</td><td>{{object.start.longitude}}</td></tr>{{/object}}";
	
	var renderRides = function( tbody, result ) {
		
		var html = Mustache.to_html(ridesTemplate, result );
		tbody.html( html );
		
	};
	
	$jq("#add").click( function() {
		 
		navigator.geolocation.getCurrentPosition( createRide, onError);
		
	} );
	
	var createRide = function(position) {
		
		var ride 
			= new Ride( position.latitude, position.latitude );
	
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
    	
	}
	catch( err ) {
		alert("error");
	}

	
});
