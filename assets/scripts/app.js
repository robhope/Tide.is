$.modal.defaults = {
  overlay: "#000",        // Overlay color
  opacity: 0.75,          // Overlay opacity
  zIndex: 1,              // Overlay z-index.
  escapeClose: true,      // Allows the user to close the modal by pressing `ESC`
  clickClose: true,       // Allows the user to close the modal by clicking the overlay
  closeText: 'Close',     // Text content for the close <a> tag.
  closeClass: '',         // Add additional class(es) to the close <a> tag.
  showClose: false,        // Shows a (X) icon/link in the top-right corner
  modalClass: "modal",    // CSS class added to the element being displayed in the modal.
  spinnerHtml: null,      // HTML appended to the default spinner during AJAX requests.
  showSpinner: true,      // Enable/disable the default spinner during AJAX requests.
  fadeDuration: 250,     // Number of milliseconds the fade transition takes (null means no transition)
  fadeDelay: 1.0          // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
};

$(function () {
	function showTide(position) {
    $('#loadingInfo').text('Fetching your tide information');
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
        $('#tide').append($('<div>').addClass('wrapper').text('Location detection has been denied, please enable Location Services in your device privacy settings.'));
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