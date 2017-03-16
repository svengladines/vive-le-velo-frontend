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
