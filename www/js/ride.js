var $jq = jQuery.noConflict();
var foreGroundTracker = null;
var backGroundTracker = null;

var rideID = function () {

    	return $jq( "#ride-uuid" ).attr("data-uuid");

};
	
var loadLocations = function( callbacks ) {
    	
	var url = locationsURL( rideID() );
    	
	getLocations( url, callbacks );
    	
};
	
var postLocation = function ( location, callback ) {
	
	renderStatus( "Sending location: [" + location.longitude + "," + location.latitude + "]" );
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
	
var renderLocation = function( location ) {
	
	$jq("#long").html( location.coords.longitude );
	$jq("#lat").html( location.coords.latitude );
	
};

// ### rendering

var renderStatus = function( status ) {
	
	var container = $jq("#vive-status");
	
	if ( status ) {
		container.html( status );
	} else {
		container.html( "" );
	}
}

var renderMap = function( locations ) {
		if ( locations.length > 0 ) {
			var mostRecentLocation = locations[ 0 ];
			var map = L.map('vive-map').setView([mostRecentLocation.lattitude,mostRecentLocation.longitude], 13);
			L.marker([mostRecentLocation.lattitude,mostRecentLocation.longitude]).addTo(map);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
		}
}

var renderActions = function( locations ) {
	var container = $jq("#vive-actions");
	var template = $jq("#actionsTemplate").html();
	var joinAction = new Action("join","play_circle_outline");
	var unjoinAction = new Action("unjoin","pause_cirle_outline"); 
	var actions = [ joinAction, unjoinAction  ];
	var view = { "actions" : actions };
	var html = Mustache.to_html(template, view );
	container.html( html );
	
	$jq("#join").click( function() {
    	
    	join();


	} );
		
	$jq("#unjoin").click( function() {
		
	    	unjoin();
	
	
	} );
		
	$jq("#delete").click( function() {
		
	    	del();
	
	
	} );


}

// ### loading

var loadAll = function( ) {

	renderStatus( "Loading data" );
	var uuid = getParameter(window.location.href,"q");
	var url = locationsURL( uuid );
	var callbacks = { renderStatus, renderMap, renderActions };
	getLocations( url, callbacks );
		
};
	
var ping = function() {
		
	renderStatus( "Ping..." );
	navigator.geolocation.getCurrentPosition( updateLocation, onError, { timeout: 20000, enableHighAccuracy: true } );
		
};
	
var updateLocation = function( position ) {
		
	var rideUuid = rideID();
		
	var riderUuid = getActor();
		
	var l = new Location( rideUuid, riderUuid, position.coords.latitude, position.coords.longitude );
		
	postLocation( l, loadAll );
		
}
	
var track = function( ) {
	
	renderStatus( "track" );
	
	if ( foreGroundTracker == null ) {
		
		foreGroundTracker = window.setInterval( ping, 60000 );
		
	}
		
};

var untrack = function( ) {
		
	window.clearInterval( foreGroundTracker );
	tracker = null;
	cordova.plugins.backgroundMode.disable();
		
};
	
var join = function( position ) {
	
	renderStatus( "Start tracking" );
	
	ping();
	track( );
		
};

var unjoin = function( position ) {
	
	// stop tracking
	untrack( );
	renderStatus( "Stopped tracking" );
		
};

var del = function( ) {
	
	var uuid = rideID();
	deleteRide( rideURL( uuid ), backToSquareOne );
		
};

var backToSquareOne = function () {
	window.location.href = "rides.html";
}

function onError(error) {
	$jq("#error").html( error.message );
	console.error( error );
};
    
jQuery( document ).ready(function() {
	
	try {
		
		document.addEventListener('deviceready', function () {

			cordova.plugins.backgroundMode.on('activate', function() {
				renderStatus("backgroundmode activated");
				backGroundTracker = window.setInterval( ping, 60000 );
			});
			
			cordova.plugins.backgroundMode.on('deactivate', function() {
				renderStatus("backgroundmode deactivated");
				window.clearInterval( backGroundTracker );
			});
		
			if ( ! cordova.plugins.backgroundMode.isEnabled() ) {
				
				cordova.plugins.backgroundMode.enable();
				
			}
		}, false );

		var uuid = getParameter(window.location.href,"q");
	        $jq( "#ride-uuid" ).attr("data-uuid", uuid );
		loadAll();
	    
	}
	catch( err ) {
		$jq("#error").html( err );
		console.error( err );
	}


});
