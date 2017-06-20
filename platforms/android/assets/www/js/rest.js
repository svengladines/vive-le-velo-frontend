var scheme = "http://localhost:8067";
// var scheme = "http://vive-le-velo-backend.appspot.com";

var url = function ( sub ) {
	return scheme + "/api" + sub;
}

var getRide = function ( url, callback ) {
	
	$jq.ajax( {
		type: "get",
		url: url,
		dataType: "json",
	    processData: false,
		success: function( returned ) {
			if ( callback ) {
				callback( returned );
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

var getLocations = function ( url, callback ) {

	$jq.ajax( {
		type: "get",
		url: url,
		dataType: "json",
	    processData: false,
		success: function( returned ) {
			callback( returned );
		},
		error: function(  jqXHR, textStatus, errorThrown ) {
			console.log( errorThrown );
		}
	});
	
};