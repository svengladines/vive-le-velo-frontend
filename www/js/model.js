var $jq = jQuery.noConflict();

var Coordinate = function( latitude, longitude ) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
	
var Ride = function ( uuid, status, latitude, longitude ) {
	if ( latitude && longitude ) {
		this.start = new Coordinate( latitude, longitude );
	}
	this.uuid = uuid;
	this.status = status;
};

var Location = function ( rideUuid, riderUuid, latitude, longitude ) {
	this.rideID = rideUuid;
	this.riderID = riderUuid;
	this.latitude = latitude;
	this.longitude = longitude;
	this.comment = null;
	this.event = null;
}