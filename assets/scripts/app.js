$(function () {
	function showTide(position) {
    $.ajax({
      url: 'http://192.168.0.2:8001/tide/' + 
        position.coords.latitude.toFixed(2) + '/' + 
        position.coords.longitude.toFixed(2) + '/' +
        moment().unix()
    }).done(function(result) {

      $("#loading").hide();
      $("#content").show();

      $('#time').html(moment().format('ddd, DD MMM YYYY'));

      if (result.extremes.length) {
        result.extremes.sort(function (a, b) { return a.time - b.time;}).forEach(function (tide) {
          var row = $('<div>').addClass('row');
          var wrapper = $('<div>').addClass('wrapper');

          wrapper.append($('<div>').addClass('cell').text(tide.type));
          wrapper.append($('<div>').addClass('cell').text(moment.unix(tide.time).format('HH\\hm')));
          wrapper.append($('<div>').addClass('cell').text(tide.height + 'm'));

          row.append(wrapper);

          $('#tide').append(row);
        });

      } else {
        $('#tide').append($('<div>').addClass('wrapper').text('Sorry, your location is not near a known tide station'));
      }
      
      
      if (result.location) {
        $('#stationWrapper').show();
        var lat = parseFloat(result.location.coordinate[0]).toFixed(2);
        var lon = parseFloat(result.location.coordinate[1]).toFixed(2);
        $('#station').html(lat + ',' + lon + ' - ' + parseFloat(result.location.distance).toFixed(1) + 'km away');
      }
    });
  }

  function showError(error) {
    $("#loading").hide();
    $("#content").show();
      
    switch(error.code) {
      case error.PERMISSION_DENIED:
        $('#tide').append($('<div>').addClass('wrapper').text('Location detection has been denied, please enable location services in your device settings.'));
        break;
      case error.POSITION_UNAVAILABLE:
        $('#tide').append($('<div>').addClass('wrapper').text('Sorry, location information is unavailable at this time, please try again later.'));
        break;
      case error.TIMEOUT:
        $('#tide').append($('<div>').addClass('wrapper').text('Sorry, we timed out trying to get your location, please try again later.'));
        break;
      case error.UNKNOWN_ERROR:
        $('#tide').append($('<div>').addClass('wrapper').text('An unknown error occurred trying to get your location, please try again later.'));
        break;
    }
  }

  navigator.geolocation.getCurrentPosition(showTide, showError);
});