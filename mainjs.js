const listItems = document.querySelectorAll('nav .nav-item');


listItems.forEach(listItem => {
  listItem.addEventListener('click', () => {
    listItems.forEach(listItem => {
      listItem.classList.remove('active');
    });
    listItem.classList.add('active');
  });
});


function initMap() {
  // Map options
  let options = {
    zoom: 8,
    center: { lat: 7.356033977636596, lng: 125.85744918370949 },
    scrollwheel: true
  }
  // New map
  let map = new google.maps.Map(document.getElementById('map'), options);

  // Listen for click on map
  google.maps.event.addListener(map, 'click', function (event) {
    // Add marker
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    console.log("Latitude: " + lat + " Longitude: " + lng);
  //  addMarker({ coords: event.latLng });

    var geocoder = new google.maps.Geocoder;
    var latlng = { lat: lat, lng: lng };
    geocoder.geocode({ 'location': latlng },
      function (results, status) {
        if (status === 'OK') {
          if (results[0]) {
            console.log(results[0].place_id);
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      })

    fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJoR4Yj95Q-TIRTPW3SK0PlnE&fields=name&key=AIzaSyA2fKRGlHKzZBP21yK5rF6NdKhP8pIKx4M')
      .then(response => response.json())
      .then(data => {
        // process the JSON data here
        console.log(data);
      });
  
 });



  /*
  // Add marker
  let marker = new google.maps.Marker({
    position:{lat:42.4668,lng:-70.9495},
    map:map,
    icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
  });

  let infoWindow = new google.maps.InfoWindow({
    content:'<h1>Lynn MA</h1>'
  });

  marker.addListener('click', function(){
    infoWindow.open(map, marker);
  });
  */

  // Array of markers
  // let markers = [
  //   {
  //     coords: { lat: 42.4668, lng: -70.9495 },
  //     //  iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
  //     content: '<h1>Lynn MA</h1>'
  //   },
  //   {
  //     coords: { lat: 42.8584, lng: -70.9300 },
  //     content: '<h1>Amesbury MA</h1>'
  //   },
  //   {
  //     coords: { lat: 42.7762, lng: -71.0773 }
  //   }
  // ];

  // Loop through markers
  // for (let i = 0; i < markers.length; i++) {
  //   // Add marker
  //   addMarker(markers[i]);
  // }

  // Add Marker Function
  // function addMarker(props) {
  //   let marker = new google.maps.Marker({
  //     position: props.coords,
  //     map: map,
  //     //icon:props.iconImage
  //   });

  //   // Check for customicon
  //   if (props.iconImage) {
  //     // Set icon image
  //     marker.setIcon(props.iconImage);
  //   }

  //   // Check content
  //   if (props.content) {
  //     let infoWindow = new google.maps.InfoWindow({
  //       content: props.content
  //     });

  //     marker.addListener('click', function () {
  //       infoWindow.open(map, marker);
  //     });
  //   }
  // }
}

window.onload = function () {
  initMap()
};