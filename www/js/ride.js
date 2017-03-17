 var map;
      
      require([
        "esri/map", "esri/geometry/Point", 
        "esri/symbols/SimpleMarkerSymbol", "esri/graphic",
        "dojo/_base/array", "dojo/dom-style", "dojox/widget/ColorPicker", 
        "dojo/domReady!"
      ], function(
        Map, Point,
        SimpleMarkerSymbol, Graphic,
        arrayUtils, domStyle, ColorPicker
      ) {

        map = new Map("map",{
          basemap: "streets",
          center: [ 11.333333, 43.333333 ],
          zoom: 11,
          minZoom: 2
        });
        
        map.on("load", mapLoaded);
      
        function mapLoaded(){
          var points = [[19.82,41.33],[16.37,48.21],[18.38,43.85],[23.32,42.7],[16,45.8],[19.08,47.5],[12.48,41.9],[21.17,42.67],[21.43,42],[19.26,42.44],[26.1,44.43],[12.45,43.93],[20.47,44.82],[17.12,48.15],[14.51,46.06],[12.45,41.9]];
          var iconPath = "M24.0,2.199C11.9595,2.199,2.199,11.9595,2.199,24.0c0.0,12.0405,9.7605,21.801,21.801,21.801c12.0405,0.0,21.801-9.7605,21.801-21.801C45.801,11.9595,36.0405,2.199,24.0,2.199zM31.0935,11.0625c1.401,0.0,2.532,2.2245,2.532,4.968S32.4915,21.0,31.0935,21.0c-1.398,0.0-2.532-2.2245-2.532-4.968S29.697,11.0625,31.0935,11.0625zM16.656,11.0625c1.398,0.0,2.532,2.2245,2.532,4.968S18.0555,21.0,16.656,21.0s-2.532-2.2245-2.532-4.968S15.258,11.0625,16.656,11.0625zM24.0315,39.0c-4.3095,0.0-8.3445-2.6355-11.8185-7.2165c3.5955,2.346,7.5315,3.654,11.661,3.654c4.3845,0.0,8.5515-1.47,12.3225-4.101C32.649,36.198,28.485,39.0,24.0315,39.0z";
          var initColor = "#ce641d";
          arrayUtils.forEach(points, function(point) {
            var graphic = new Graphic(new Point(point), createSymbol(iconPath, initColor));
            map.graphics.add(graphic);
          });
          
          var colorPicker = new ColorPicker({}, "picker1");
          colorPicker.setColor(initColor);
          domStyle.set(colorPicker, "left", "500px");
          colorPicker.on("change", function(){
            var colorCode = this.hexCode.value;
            map.graphics.graphics.forEach(function(graphic){
              graphic.setSymbol(createSymbol(iconPath, colorCode));
            });
          });
        }
        
        function createSymbol(path, color){
          var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
          markerSymbol.setPath(path);
          markerSymbol.setColor(new dojo.Color(color));
          markerSymbol.setOutline(null);
          return markerSymbol;
        }
      });

var $jq = jQuery.noConflict();

var storeActor = function( userID ) {
        var key = "userID";
	var storage = window.localStorage;
	storage.setItem(key, userID );
}

jQuery( document ).ready(function() {

	$jq("#save").click( function() {

		storeActor( $jq("#userID").val() );
		window.location.href="index.html";

	} );
});
