var $jq = jQuery.noConflict();

var Coordinate = function( latitude, longitude ) {
		this.latitude = latitude;
		this.longitude = longitude;
	}
	
var Ride = function ( uuid, status, latitude, longitude ) {
	
	this.uuid = uuid;
	
	if ( latitude && longitude ) {
		this.start = new Coordinate( latitude, longitude );
	}
	
	if ( status ) {
		this.status = status;
	}
};

var Location = function ( rideUuid, riderUuid, latitude, longitude ) {
	this.rideID = rideUuid;
	this.riderID = riderUuid;
	this.latitude = latitude;
	this.longitude = longitude;
	this.comment = null;
	this.event = null;
};

var Action = function( id, symbol ) {
	
	this.id = id;
	this.symbol = symbol;
	
};

var serialize = function( element ) {
    var o = {};
    var a = element.serializeArray();
    $jq.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

