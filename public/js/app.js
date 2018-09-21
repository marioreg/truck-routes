$(document).ready(function () {

// This .on("click") function will trigger the AJAX Call
$("#find-route").on("click", function(event) {
  // event.preventDefault() can be used to prevent an event's default behavior.
  // Here, it prevents the submit button from trying to submit a form when clicked
  event.preventDefault();

  var avoidArray = [];
  var materialsarray = [];
  //function that returns the value of the checkbox element for the Avoid section
  function avoidBoxes(id) {
      if ($(id).is(":checked") == true) {
          var result = $(id).val();
          avoidArray.push(result);
      } else {
          result = "";
      }
      return result;
  };

  //function that returns the value of the checkbox element for the Materials section

  function materialBoxes(id) {
      if ($(id).is(":checked") == true) {
          var result = $(id).val();
          materialsarray.push(result);
      } else {
          result = "";
      }
      return result;
  };

  var start = $("#start").val();
  var dest = $("#destination").val();


  //Used the checkBoxes function for checkbox items
  var highways = avoidBoxes('#highways');
  var tolls = avoidBoxes('#tolls');
  var minimizeHighways = avoidBoxes('#minimizeHighways');
  var minimizeTolls = avoidBoxes('#minimizeTolls');
  var ferry = avoidBoxes('#ferry');
  console.log("Avoid Array is: " + avoidArray.toString());
  var avoidStr = avoidArray.toString();



  //Getting values from the form
  var vehicleHeight = $("#vehicleHeight").val();
  var vehicleWidth = $("#vehicleWidth").val();
  var vehicleLength = $("#vehicleLength").val();
  var vehicleWeight = $("#vehicleWeight").val();
  var vehicleAxles = $("#vehicleAxles").val();
  var vehicleTrailers = $("#vehicleTrailers").val();
  var vehicleSemi = $("#vehicleSemi").val();

  //Used the checkBoxes function for checkbox items

  var Combustible = materialBoxes('#Combustible');
  var Corrosive = materialBoxes('#Corrosive');
  var Explosive = materialBoxes('#Explosive');
  var Flammable = materialBoxes('#Flammable');
  var FlammableSolid = materialBoxes('#FlammableSolid');
  var Gas = materialBoxes('#Gas');
  var Organic = materialBoxes('#Organic');
  var Poison = materialBoxes('#Poison');
  var PoisonousInhalation = materialBoxes('#PoisonousInhalation');
  var Radioactive = materialBoxes('#Radioactive');
  var None = materialBoxes('#None');
  console.log("Materials Array is: " + materialsarray.toString());
  var materialsStr = materialsarray.toString();


  // Here we construct our URL for the Bing Mapsn API
  var queryURL =
      "https://dev.virtualearth.net/REST/v1/Routes/Truck?wp.0=" +
      start +
      "&wp.1=" +
      dest +
      "&avoid=" +
      avoidStr +
      "&vehicleHeight=" +
      vehicleHeight +
      "&vehicleWidth=" +
      vehicleWidth +
      "&vehicleLength=" +
      vehicleLength +
      "&vehicleWeight=" +
      vehicleWeight +
      "&vehicleAxles=" +
      vehicleAxles +
      "&vehicleTrailers=" +
      vehicleTrailers +
      "&vehicleSemi=" +
      vehicleSemi +
      "&vehicleHazardousMaterials=" +
      materialsStr +
      "&key=AsVP6rd9XRwssfgC-IXPOoSNFWxRMrLGA2pgBEL4m0Zq8TDqkVOhTUXwl3FA9JLs";

  console.log(queryURL);

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    $("#bing-view").text(JSON.stringify(response));
    console.log(response);

    var startLocation = {
      latitude:
        response.resourceSets[0].resources[0].routeLegs[0].actualStart
          .coordinates[0],
      longitude:
        response.resourceSets[0].resources[0].routeLegs[0].actualStart
          .coordinates[1]
    };

    var endLocation = {
      latitude:
        response.resourceSets[0].resources[0].routeLegs[0].actualEnd
          .coordinates[0],
      longitude:
        response.resourceSets[0].resources[0].routeLegs[0].actualEnd
          .coordinates[1]
    };

    var tripDuration = response.resourceSets[0].resources[0].travelDuration;

    //We store the number of maneuvers in variable
    var maneuvers =
      response.resourceSets[0].resources[0].routeLegs[0].itineraryItems.length;
    console.log("Maneuver variable is: " + maneuvers);

    // Declare array to store lat and long as objects
    var routeCoordinates = [];
    var lattitude = "latitude";
    var longitude = "longitude";

    //Loop to store all latitude and longitude data as objects into the routeCoordinates array
    for (var i = 0; i < maneuvers; i++) {
      var obj = {};
      obj["latitude"] =
        response.resourceSets[0].resources[0].routeLegs[0].itineraryItems[
          i
        ].maneuverPoint.coordinates[0];
      obj["longitude"] =
        response.resourceSets[0].resources[0].routeLegs[0].itineraryItems[
          i
        ].maneuverPoint.coordinates[1];

      routeCoordinates.push(obj);
    }

    console.log(
      "Start location: " +
        startLocation.latitude +
        "," +
        startLocation.longitude
    );
    console.log(
      "End location: " + endLocation.latitude + "," + endLocation.longitude
    );
    console.log("Trip duration: " + tripDuration / 3600 + " hours");

    console.log(routeCoordinates);
    console.log(
      "The length of routes in waypoints is: " + routeCoordinates.length
    );

    var startPoint = startLocation.latitude + "," + startLocation.longitude;
    var endPoint = endLocation.latitude + "," + endLocation.longitude;

    console.log("Start Point variable: " + startPoint);
    console.log("End point variable: " + endPoint);
    console.log("Type of startPoint variable: " + typeof startPoint);
    console.log("Type of endPoint variable: " + typeof endPoint);

    // For loop to construct the URL for the Google Maps API
    var str =
      "https://www.google.com/maps/dir/?api=1&origin=" +
      startPoint +
      "&destination=" +
      endPoint +
      "&travelmode=driving&waypoints=";
    for (var j = 0; j < routeCoordinates.length; j++) {
      str += routeCoordinates[j].latitude;
      str += ",";
      str += routeCoordinates[j].longitude;
      str += "|";
    }
    str = str.slice(0, -1);


    console.log("The Google string is: " + str);
    console.log(typeof str);


    $("<a href='" + str + "' data-role='button' target='_blank'><button>Go to my map</button></a>").button().appendTo('#map');


  });
});


});

