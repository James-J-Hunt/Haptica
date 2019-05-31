// Version 18

// Compass Code and alpha data etc inspired and adapted from HTML5 for the Mobile Web: Device Orientation Events
// https://mobiforge.com/design-development/html5-mobile-web-device-orientation-events

// Code also an combination of many helpful tutorials online but no major code taken just used to fix small issues

// c1 location = -41.29632743891323, 174.7798232221797
// c2 location = -41.29668717414107, 174.78073323191197
// d location  = -41.2967531,        174.7806263
// diverge              4                   4
// 5th decimal place

function compass() {
  document.getElementById("compassImages").style.display = 'block';
  document.getElementById("coordinates").style.display = 'block';
  document.getElementById("button").style.display = 'none';

  // Declares variables now so they can be used by everything
  var latC; // Current Latitude variable declaration for use
  var longC; // Current Longitude variable declaration for use
  var heading; // Current Heading variable declaration for use

  // Takes the variables transfered over from the index page that were searched for use and calculations
  var tHash = window.location.hash.split('#').pop();
  var latD = tHash.split(';')[0]; // Destination Latitude
  var longD = tHash.split(';')[1]; // Destination Longitude
 
  // Check for support for DeviceOrientationAbsolute event and executes if the is support
  if(window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientationabsolute', function(event) { // absolute
      var alpha; // Variable holder for alpha as it has different applications over different devises
      var northDegree; // Variable holder for how many degrees you are from North, can't be calculated yet
      var direction; 

      var dArrow= document.getElementById('direct');
      var nArrow = document.getElementById('north');

      // Check for iOS properties
      if(event.webkitCompassHeading) {
        alpha = event.webkitCompassHeading; // Calculates where North is for iPhone.
        //Rotation is reversed for iOS
        nArrow.style.WebkitTransform = 'rotate(-' + alpha + 'deg)';
        document.getElementById('phone').innerHTML = 'iPhone';
      }

      // Non iOS.
      else {
        alpha = event.alpha; // Sets alpha for Andriod
        webkitAlpha = alpha; // To be used for the chrome
        document.getElementById('phone').innerHTML = 'Andriod';

        //Assume Android stock (this is crude, will reccomend change to chrome) and apply offset
        if(!window.chrome) {
          webkitAlpha = alpha - 270;
          document.getElementById('phone').innerHTML = 'Andriod - Non Chrome';
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

      //Calculations to do with the data to get information needed

      // Sets the angle 0/360 point in the direction of the location. At 0/360 will be pointing at the location you want to go
      var angle = alpha + heading;

      // Keeps angle within 0 - 360 range again
      if (angle >= 360) {angle = angle - 360;}
      else if (angle <= 0) {angle = angle + 360;}

      // Controls variable which acts like the angle variable but instead between the value of 0 and 180 and describes how big
      // the difference is between the alpha and heading angle. Is then used to apply the colouring
      if (angle < 180) {direction = angle;}
      else {direction = (360 - angle) * -1;}

      //Displaying of the data as a compass
      nArrow.style.Transform = 'rotate(' + alpha + 'deg)';
      nArrow.style.WebkitTransform = 'rotate('+ webkitAlpha + 'deg)';
      nArrow.style.MozTransform = 'rotate(-' + alpha + 'deg)'; 

      dArrow.style.transform = 'rotate(' + direction + 'deg)';
      dArrow.style.WebkitTransform = 'rotate(' + direction + 'deg)';
      dArrow.style.MozTransform = 'rotate(' + direction + 'deg)';

      // Calculates the prixoimity to the location
      latA = latC - latD;
      longA = longC - longD;

      if (latA <= 0.001 && latA >= -0.001 && longA <= 0.001 && longA >= -0.001) {
        vibrate();
      }
      else {
        // TESTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        document.getElementById("container").style.backgroundColor = 'rgb(180, 180, 180)';
        // TESTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      }

      // TESTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      document.getElementById('latC').innerHTML = latC;
      document.getElementById('longC').innerHTML = longC;
      document.getElementById('latD').innerHTML = latD;
      document.getElementById('longD').innerHTML = longD;
      document.getElementById('heading').innerHTML = heading;
      document.getElementById('alpha').innerHTML = alpha;
      document.getElementById('direction').innerHTML = direction;
      document.getElementById('latA').innerHTML = latA;
      document.getElementById('longA').innerHTML = longA;
      // TESTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    }, false); // This could also be what loops the code. I am not fully sure
  }
}

function vibrate(duration, interval) {
  navigator.vibrate([3000, 2000, 1000]);
  // TESTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  document.getElementById("container").style.backgroundColor = 'rgb(66, 244, 101)';
  // TESTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}