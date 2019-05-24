// Version 2

// Map code is baseds on Google Maps Platform Geocoding Service code. 
// https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple?fbclid=IwAR3CdZ7HGf8jQHV5rKKkPwOL1HVNK8gpIPBZhMbb5ANB9yst2mW4YFrECdY

function initMap() {
  // Initiates a new map. Not displayed on website, but use to gether the data below
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: -41.286, lng: 174.776} // My addition. Changed coordinates to focus on Wellington
  });
  //Loads the geocoder for the map, to impliment markers
  var geocoder = new google.maps.Geocoder();

  // When the submit button is pressed executes the geocodeAddress. Which gets the desired location data
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map); // Function executed and thats the variables of the stated address
  });
}

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value; // Takes the address entered
  var latLong2 = document.getElementById('latLong2'); // Holds the container to show the coordinate data for desire location

  // Not sure how this works complete but have left comments where I understand and is needed
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location); // Finds the location
      var marker = new google.maps.Marker({
        // Puts a Marker at that result
        map: resultsMap,
        position: results[0].geometry.location
      });

      var lat = marker.getPosition().lat(); // Gets the latitude of the desire location and holds it in a variable
      var long = marker.getPosition().lng(); // Gets the longitude of the desire location and holds it in a variable

      // Changes variables to show Destination FOR TESTING
      document.getElementById('latD').innerHTML = lat;
      document.getElementById('longD').innerHTML = long;
    } 
    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}