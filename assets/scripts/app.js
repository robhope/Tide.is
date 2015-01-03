$(function () {
	function timedUpdate () {
    $('#time').html(moment().format('HH:mm - DD MMM YYYY'));
    setTimeout(timedUpdate, 60 * 1000);
  }

  function showTide(position) {
    $.ajax({
      url: 'https://tide-api.herokuapp.com/' + 
        position.coords.latitude.toFixed(2) + 'N/' + 
        position.coords.longitude.toFixed(2) + 'E'
    }).done(function(result) {
      $('#tide').html(result.data);
      $('#station').html(result.station);
    });
  }

  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        $('#tide').html('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        $('#tide').html('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        $('#tide').html('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        $('#tide').html('An unknown error occurred.');
        break;
    }
  }

  timedUpdate();
  navigator.geolocation.getCurrentPosition(showTide, showError);
});