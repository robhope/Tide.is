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
      url: 'https://tide-api.herokuapp.com/' + 
        position.coords.latitude.toFixed(2) + 'N/' + 
        position.coords.longitude.toFixed(2) + 'E'
    }).done(function(result) {

      $("#loading").hide();
      $("#content").show();

      $('#time').html(moment().format('ddd, DD MMM YYYY'));

      if (result.tides.length) {
        result.tides.forEach(function (tide) {
          var row = $('<div>').addClass('row');
          var wrapper = $('<div>').addClass('wrapper');

          wrapper.append($('<div>').addClass('cell').text(tide.type));
          wrapper.append($('<div>').addClass('cell').text(moment(tide.time, 'h:mm a').format('HH\\hmm')));
          
          var tideHeight = parseFloat(tide.height).toFixed(1);
          wrapper.append($('<div>').addClass('cell').text(tideHeight + 'm'));

          row.append(wrapper);

          $('#tide').append(row);
        });

      } else {
        $('#tide').append($('<div>').addClass('wrapper').text('Sorry, your location is not near a known tide station'));
      }
      
      
      if (result.station) {
        $('#stationWrapper').show();
        $('#station').html(result.station.location + ' - ' + result.station.distance + ' away');
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