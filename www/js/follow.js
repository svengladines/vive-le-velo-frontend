var $jq = jQuery.noConflict();
var XMap;
var XPoint;
var XGraphic;
var XCircle;

var map;
var points = [];
//var markerPath = "M24.0,2.199C11.9595,2.199,2.199,11.9595,2.199,24.0c0.0,12.0405,9.7605,21.801,21.801,21.801c12.0405,0.0,21.801-9.7605,21.801-21.801C45.801,11.9595,36.0405,2.199,24.0,2.199zM31.0935,11.0625c1.401,0.0,2.532,2.2245,2.532,4.968S32.4915,21.0,31.0935,21.0c-1.398,0.0-2.532-2.2245-2.532-4.968S29.697,11.0625,31.0935,11.0625zM16.656,11.0625c1.398,0.0,2.532,2.2245,2.532,4.968S18.0555,21.0,16.656,21.0s-2.532-2.2245-2.532-4.968S15.258,11.0625,16.656,11.0625zM24.0315,39.0c-4.3095,0.0-8.3445-2.6355-11.8185-7.2165c3.5955,2.346,7.5315,3.654,11.661,3.654c4.3845,0.0,8.5515-1.47,12.3225-4.101C32.649,36.198,28.485,39.0,24.0315,39.0z";
var markerPath = "M11,11,L,12,11,L,12,12,L,11,12,Z";
var markerColor = "#ce641d";

var rideURL = function ( uuid ) {
	
	return "https://vive-le-velo-backend.appspot.com/api/rides/" + uuid ;
	
};

var locationsURL = function ( ) {
	
	return "https://vive-le-velo-backend.appspot.com/api/locations";
	
};

var loadMap = function( center ) {
	
	 map = new XMap("map",{
          basemap: "streets",
          center: [ center.longitude, center.latitude ],
          zoom: 11,
          minZoom: 2
     });
	 
	 map.on( "load", getLocations );
	
}

var getRide = function ( uuid, callback ) {
	
	var u = rideURL( uuid ); 
	
	$jq.ajax( {
		type: "get",
		url: u,
		dataType: "json",
	    processData: false,
		success: function( returned ) {
			if ( callback ) {
				callback( returned.object.start );
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

var getLocations = function ( ) {
	
	var rideUuid = $jq("#ride-uuid").val();
	
	var u
		= locationsURL() + "?rideID=" + rideUuid + "&last=10";
	
	$jq.ajax( {
		type: "get",
		url: u,
		dataType: "json",
	    processData: false,
		success: function( returned ) {
			locationsReceived( returned );
		},
		error: function(  jqXHR, textStatus, errorThrown ) {
			console.log( errorThrown );
		}
	});
	
};

var locationsReceived = function( locations ) {
	
	for (i = 0; i < locations.length; i++) {
		var location = locations[ i ];
		var l = [ location.longitude, location.lattitude, location.color ];
		points.push( l );
		
		for (i = 0; i < points.length; i++) {
		    	var point = [ points[i][0], points[i][1]];
		    	var c = points[i][2];
		    	var p = new XPoint(point);
		    	var s = createSymbol(markerPath, c);
		    	var a = {};
		    	a["data-rider"]="reini";
		    	var graphic = new XGraphic(p,s,a);
		      	map.graphics.add(graphic);
		};
		
	};
	
};

var createSymbol = function(path, color){
    var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
    markerSymbol.setPath(path);
    markerSymbol.setColor(new dojo.Color(color));
    markerSymbol.setOutline(null);
    return markerSymbol;
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

jQuery( document ).ready(function() {

	require([
        "esri/map", "esri/geometry/Point",
        "esri/symbols/SimpleMarkerSymbol", "esri/graphic",
        "dojo/_base/array", "dojo/dom-style", "dojox/widget/ColorPicker", 
        "dojo/domReady!"
      ], function(
        Map, Point,
        SimpleMarkerSymbol, Graphic,
        arrayUtils, domStyle, ColorPicker ) {

	/*
	          var colorPicker = new ColorPicker({}, "picker1");
	          colorPicker.setColor(initColor);
	          domStyle.set(colorPicker, "left", "500px");
	          colorPicker.on("change", function(){
	            var colorCode = this.hexCode.value;
	            map.graphics.graphics.forEach(function(graphic){
	              graphic.setSymbol(createSymbol(iconPath, colorCode));
	            });
	          });	
	          */
			XMap = Map;
			XPoint = Point;
			XGraphic = Graphic;
			

		    try {
		    	var uuid = getParameter(window.location.href,"q");
		    	$jq("#ride-uuid").val( uuid );
		    	getRide( uuid, loadMap );
			}
			catch( err ) {
				console.error( err );
			}
			
			
			
        });

});
