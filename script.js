
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

var autocomplete_start, autocomplete_end;
var place_start, place_end;


function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var thisCity = new google.maps.LatLng(40.4600818, 48.3240209);
  var myOptions = {
    zoom:8,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: thisCity
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("directionsPanel"));

  var input_start = document.getElementById("startPlace");
  var input_end = document.getElementById("endPlace");
  var options = {
    componentRestrictions: {country:'az'}
  }
  autocomplete_start = new google.maps.places.Autocomplete(input_start, options);
  google.maps.event.addListener(autocomplete_start, 'place_changed', function() {
    place_start = autocomplete_start.getPlace();
  });

  autocomplete_end = new google.maps.places.Autocomplete(input_end, options);
  google.maps.event.addListener(autocomplete_end, 'place_changed', function() {
    place_end = autocomplete_end.getPlace();
  });
}

function calcRoute() {
  var start = document.getElementById("startPlace").value + ', Баку, Азербайджан';
  var end = document.getElementById("endPlace").value + ', Баку, Азербайджан';

  if (typeof(place_start) != 'undefined') {
    start = new google.maps.LatLng(place_start.geometry.location.lat(), place_start.geometry.location.lng());
    console.log(place_start);
    console.log(start);
  }
  if (typeof(place_end) != 'undefined') {
    end = new google.maps.LatLng(place_end.geometry.location.lat(), place_end.geometry.location.lng());
    console.log(place_end);
    console.log(end);
  }

  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
      var price_for_selected = document.getElementById('price_for_selected');
      var myRoute = result.routes[0].legs[0];

      var commonDistanse = myRoute.distance.value / 1000;

        if (commonDistanse <= 3) {
            price = 2
        } else if (commonDistanse > 3 && commonDistanse <=12) {
            price = (commonDistanse - 3) * 0.5 + 2
        } else if (commonDistanse > 12 && commonDistanse <=70) {
            price = (commonDistanse - 12) * 0.4 + 2 + (9 * 0.5)
        } else {
            price = (commonDistanse - 70) * 0.22 + (70 * 0.4)
        }

      var innerHtml = '<div class="alert alert-success" role="alert"> ';
      innerHtml += '<p>Расстояние: </td><td>' + myRoute.distance.text + '</p>';
      innerHtml += '<p>Время в пути: </td><td>' + myRoute.duration.text + '</p>';
      innerHtml += '<p>Стоимость поездки: ' + Math.ceil(price) + ' АЗН</p>';
      innerHtml += '</div>';
      price_for_selected.innerHTML = innerHtml;
    } else {
      var price_for_selected = document.getElementById('price_for_selected');
      var innerHtml = '<div class="alert alert-warning" role="alert">Не удалось проложить маршрут. Попробуйте указать место поблизости или ввести название на другом языке. Обязательно выберите один из предложенных системой вариантов в выпадающем списке.</div>';
      price_for_selected.innerHTML = innerHtml;
      var directionsPanel = document.getElementById('directionsPanel');
      directionsPanel.innerHTML = ' ';
    }
  });
}

window.onload = initialize;

