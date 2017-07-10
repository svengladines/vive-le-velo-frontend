/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var $jq = jQuery.noConflict();

    // Update DOM on a Received Event
var updateStatus = function(value) {
	$jq("#status").html( value );
};

var identify = function() {
        var userID = this.getActor();
	if ( ! userID ) {
	    window.location.href="actor.html";
	}
	else {
	    renderRider( userID );
	}
};

var renderRider = function( rider ) {
	
	var riderTemplate = $jq("#riderTemplate").html();
	var div = $jq( "#status" );
	var html = Mustache.to_html(riderTemplate, rider );
	div.html( html );
	
};

var getActor = function() {
        var key = "userID";
	var storage = window.localStorage;
	var value = storage.getItem(key);
	return value;
};

jQuery( document ).ready(function() {
	
	var riderTemplate = $jq("#riderTemplate").html();
	
	document.addEventListener('deviceready', function () { 

		updateStatus( "Connected to device" );
		identify();

	});

});
