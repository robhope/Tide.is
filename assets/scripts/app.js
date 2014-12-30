$(function () {
	function timedUpdate () {
        $('#time').html(moment().format('HH:mm - DD MMM YYYY'));
        setTimeout(timedUpdate, 60 * 1000);
    }

    function showPosition(position) {
	    $('#location').html("Latitude: " + position.coords.latitude + 
	    "<br>Longitude: " + position.coords.longitude);
	}

    timedUpdate();

    navigator.geolocation.getCurrentPosition(showPosition);
});