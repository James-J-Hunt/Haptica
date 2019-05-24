// Version 1

// Compass Code and alpha data etc inspired and adapted from HTML5 for the Mobile Web: Device Orientation Events
// https://mobiforge.com/design-development/html5-mobile-web-device-orientation-events

// Map code is based completely on Google Maps Platform Geocoding Service code. Only a few lines of adjustments and additions
// Couldn't have had this functionalit without it, although I don't realy understand the code that well. Just well enough to
// Impliment the things I needed. Relevant code marked between two comments which say (// GMP - GS Start) and (// GMP - GS End)
// https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple?fbclid=IwAR3CdZ7HGf8jQHV5rKKkPwOL1HVNK8gpIPBZhMbb5ANB9yst2mW4YFrECdY

// Code also an combination of many helpful tutorials online but no major code taken just used to fix small issues

//Declares the two variables used throughout the script
var latD;
var longD;

// GMP - GS Start
function initMap() {
  // Initiates a new map. Not displayed on website, but use to gether the data below
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: -41.286, lng: 174.776} // My addition. Changed coordinates to focus on Wellington
  });
  var geocoder = new google.maps.Geocoder();

  // When the submit button is pressed executes the geocodeAddress. Which gets the desired location data
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map); // Function executed and thats the variables of the stated address
  });
}

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value; // Takes the address entered
  var latLong2 = document.getElementById('latLong2'); // My addition. Holds the container to show the coordinate data for desire location

  // Not sure how this works complete but have left comments where I understand and is needed
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location); // Finds the location
      var marker = new google.maps.Marker({
        // Puts a Marker at that result
        map: resultsMap,
        position: results[0].geometry.location
      });
      var lat = marker.getPosition().lat(); // My addition. Gets the latitude of the desire location and holds it in a variable
      var long = marker.getPosition().lng(); // My addition. Gets the longitude of the desire location and holds it in a variable
      compass(lat, long); // My addition. Starts the coordinates function and enters the data found from this function
    } 
    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
// GMP - GS End

// Executes when a search has been made. Takes the coordinates of that search and provides them for use in this function
function compass (latD, longD) {
  // Variable to change the background colour
  var backColour = document.querySelector('#container');

  // Declares variables now so they can be used by everything
  var latC; // Current Latitude variable declaration for use
  var longC; // Current Longitude variable declaration for use
  var heading; // Current Heading variable declaration for use
 
  // Check for support for DeviceOrientation event and executes if the is support
  if(window.DeviceOrientationEvent) {
    // I think this is a continously executing function that is the core of the system. Based off of the Link at top and don't fully understand it
    window.addEventListener('deviceorientation', function(event) {
      var alpha; // Variable holder for alpha as it has different applications over different devises
      var accuracy; // Variable holder for alpha accuracy purely for iPhone use, can't be calculated yet
      var northDegree; // Variable holder for how many degrees you are from North, can't be calculated yet

      var colourChange;
      var colourChanger;

      // Check for iOS properties
      if(event.webkitCompassHeading) {
        alpha = event.webkitCompassHeading; // Calculates where North is for iPhone. Not perfect
        accuracy = event.webkitCompassAccuracy; // Calculates how inaccurate the variable above is

        // Tells the if statement that the device isan iPhone. Thus need to display Accuracy data
        type = 1;
      }

      // Non iOS. I don't completely understand this bit. But I have tested and it works completely
      else {
        alpha = event.alpha; // Sets alpha for Andriod
        webkitAlpha = alpha; // To be used for the chrome

        // Tells the if statement that the device is not an iPhone. Thus should have more Accurate data
        type = 0;

        // For chrome apps on Andriod I believe as they use a slightly different system. The calculate is somewhat arbitrary but will work
        if(!window.chrome) {
          webkitAlpha = alpha + 180; // Don't know how this is working, but changing it fixes dicrepensies in the Andriod App
        }
      }

      // Watches the users current Pos and returns the values to be used by the code below
      navigator.geolocation.watchPosition(function(position) {
        latC = position.coords.latitude; // Finds the Current Latitude
        longC = position.coords.longitude; // Finds the Current Longitude

        var pointA = new google.maps.LatLng(latC, longC); // Combines the current latitude and longitude into one value. Used to find heading
        var pointB = new google.maps.LatLng(latD, longD); // Combines the destinations latitude and longitude into one value. Used to find heading

        // Takes the two LatLng variables and the angle between the two of them
        heading = google.maps.geometry.spherical.computeHeading(pointA, pointB); 
      });

      // Arbitrary fix to alpha not pointing at true north. Only works for iPhone (chrome) and kind of ruins the data for any other devices
      alpha = alpha + 25;

      // Small change to account for the arbitrary solution above to keep north within 0 - 360 degrees
      if (alpha> 360) {
        alpha = alpha - 360;
      }
      else if (alpha < 0) {
        alpha = alpha + 360;
      }

      // Sets the angle 0/360 point in the direction of the location. At 0/360 will be pointing at the location you want to go
      var angle = alpha - heading;

      // Keeps angle within 0 - 360 range again
      if (angle >= 360) {
        angle = angle - 360;
      }
      else if (angle <= 0) {
        angle = angle + 360;
      }

      // Controls variable which acts like the angle variable but instead between the value of 0 and 180 and describes how big
      // the difference is between the alpha and heading angle. Is then used to apply the colouring
      if (angle < 180) {
        colourChange = angle;
      }
      else {
        colourChange = 360 - angle;
      }

      // Variable that takes the colourChange variable and applies a math equation to it to be used to fade the red to establish the wrong direction
      colourChanger = 200 - (colourChange*0.6);

      // If the phone is facing in the right direction (5 degree leeway) the site will be green. Else it will be a red that gets darker depending 
      // on how far away from the location you are facing with 180 degrees being nearly greyish, which means you are facing completel in the wrong direction
      if (colourChange <= 5) {
        backColour.style.backgroundColor = 'rgb(66, 244, 101)';
      }
      else if (colourChange > 5) {
        backColour.style.backgroundColor = 'rgb(' + colourChanger + ', 60 , 60)';
      }

      // Prints all the different values being used
      document.getElementById('latC').innerHTML = latC;
      document.getElementById('longC').innerHTML = longC;
      document.getElementById('latD').innerHTML = latD;
      document.getElementById('longD').innerHTML = longD;
      document.getElementById('heading').innerHTML = heading;
      document.getElementById('alpha').innerHTML = alpha;
      document.getElementById('colourChange').innerHTML = colourChange;

    }, false); // This could also be what loops the code. I am not fully sure
  }
}