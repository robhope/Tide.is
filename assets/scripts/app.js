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

  timedUpdate();
  navigator.geolocation.getCurrentPosition(showTide);
});