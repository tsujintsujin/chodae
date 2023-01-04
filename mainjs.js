const listItems = document.querySelectorAll('nav .nav-item');
const API_KEY = 'AIzaSyClso5DVSDxgLPUu3FwxdmhHHZEyu1hoj4';
let map;
let lati;
let longi;
let coordinates;
let closeWin;
let loc_title;
let loc_address;
let windowOpen = false;
const butt = document.getElementById("butt");
const marker = document.getElementById("marker");
let insta = document.querySelectorAll('[jstcache="4"]');
let tester = document.getElementsByClassName("title");
let close = document.querySelectorAll('[class="gm-ui-hover-effect"]');

listItems.forEach(listItem => {
  listItem.addEventListener('click', () => {
    listItems.forEach(listItem => {
      listItem.classList.remove('active');
    });
    listItem.classList.add('active');
  });
});

marker.addEventListener("click", function () {
  if (windowOpen === true) {
    markThis(coordinates, map);
  }
});

// fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJ1RqnWMdZ-TIRSA9zlRDLA-I&fields=name,formatted_address,formatted_phone_number,rating&key=AIzaSyClso5DVSDxgLPUu3FwxdmhHHZEyu1hoj4`)
// .then(response => response.json())
// .then(data => {
//   // Do something with the place details
//   console.log(data);
// });


function markThis(latlng, map) {
  const marker = new google.maps.Marker({
    position: latlng,
    map: map,
  });

}

function getPlaceData() {

  insta = document.querySelectorAll('[jstcache="4"]');
  tester = document.getElementsByClassName("title");

  try {
    loc_title = tester[0].textContent;
    loc_address = `${insta[1].textContent} ${insta[2].textContent} ${insta[3].textContent}`;
  } catch (e) {
    loc_title = "None selected";
    loc_address = "None selected";
    if (e instanceof TypeError) {
      windowOpen = false;
    }
  }

  if(loc_title != "None selected"){
    console.log(loc_title);
    console.log(loc_address);
    windowOpen = true;
  }
}


function initMap() {

  const marked = document.getElementById("marked");

  // marked.addEventListener('click', function (e) {
  //   new google.maps.Marker({
  //     position: e.latLng,
  //     map: map
  //   });
  // });


  // Map initial location
  let options = {
    zoom: 8,
    center: { lat: 7.356033977636596, lng: 125.85744918370949 },
    scrollwheel: true
  }
  // New map
  map = new google.maps.Map(document.getElementById('map'), options);

  butt.addEventListener("click", function () {
    let latLng = new google.maps.LatLng(7.177371073399362, 125.72633743286133);
    map.setZoom(12);
    map.panTo(latLng);

  });


  // Listen for click on map
  google.maps.event.addListener(map, 'click', function (event) {


    //closing previous window
    try {
      winClose = document.querySelectorAll('[class="gm-ui-hover-effect"]');
      winClose[0].click();
    } catch (e) {
      if (e instanceof TypeError) {

      }
    }

    // Add marker
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    console.log("Latitude: " + lat + " Longitude: " + lng);

    var geocoder = new google.maps.Geocoder;
    var latlng = { lat: lat, lng: lng };
    geocoder.geocode({ 'location': latlng },
      function (results, status) {
        if (status === 'OK') {
          if (results[0]) {
            //scrape info window
            getPlaceData();

            coordinates = latlng;
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      })

    // fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJoR4Yj95Q-TIRTPW3SK0PlnE&fields=name&key=AIzaSyClso5DVSDxgLPUu3FwxdmhHHZEyu1hoj4')
    //   .then(response => response.json())
    //   .then(data => {
    //     // process the JSON data here
    //     console.log(data);
    //   });

  });


  // map.addListener('click', function (e) {
  //   new google.maps.Marker({
  //     position: e.latLng,
  //     map: map
  //   });
  // });

  /*
  // Add marker
  let marker = new google.maps.Marker({
    position:{lat:42.4668,lng:-70.9495},
    map:map,
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
  window.initMap();
};


