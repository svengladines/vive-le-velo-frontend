var scheme = "http://localhost:8067";
// var scheme = "http://vive-le-velo-backend.appspot.com";

var url = function ( sub ) {
	return scheme + "/api" + sub;
}

var locationsURL = function ( rideID ) {
	return url ("/locations?rideID=" + rideID );
	
};

var ridesURL = function () {
	return url ("/rides" );
	
};

var rideURL = function ( uuid ) {
	return url ("/rides/" + uuid );
	
};

var getRide = function ( url, callbacks ) {
	
	$jq.ajax( {
		type: "get",
		url: url,
		dataType: "json",
	    processData: false,
		success: function( returned ) {
			if ( callbacks ) {
				for ( var i in callbacks ) {
					var callback = callbacks[ i ];
					callback( returned );	
				}
				
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

var getRides = function ( url, tbody, callback ) {
		
		$jq.ajax( {
			type: "get",
			url: url,
			dataType: "json",
		    processData: false,
			success: function( result ) {
				if ( callback ) {
					callback( tbody, result );
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

var putRide = function ( url, ride, element, callback ) {
		
		$jq.ajax( {
			type: "put",
			url: url,
			dataType: "json",
			contentType: "application/json;charset=\"utf-8\"",
		    processData: false,
			data: JSON.stringify( ride ),
			success: function( returned ) {
				if ( callback ) {
					callback( element, returned );
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

var deleteRide = function ( url, callback ) {
		
		$jq.ajax( {
			type: "delete",
			url: url,
			dataType: "json",
     		    	processData: false,
			success: function( deletedResult ) {
				if ( callback ) {
					callback( deletedResult );
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

var getLocations = function ( url, callbacks ) {

	$jq.ajax( {
		type: "get",
		url: url,
		dataType: "json",
	    processData: false,
		success: function( returned ) {
			if ( callbacks ) {
				for ( var i in callbacks ) {
					var callback = callbacks[ i ];
					callback( returned );	
				}
				
			}
		},
		error: function(  jqXHR, textStatus, errorThrown ) {
			console.log( errorThrown );
		}
	});
	
};
