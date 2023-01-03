const listItems = document.querySelectorAll('nav .nav-item');
// const embMap = document.getElementById('embedMap');
const API_KEY = 'AIzaSyClso5DVSDxgLPUu3FwxdmhHHZEyu1hoj4';
let map;        



listItems.forEach(listItem => {
  listItem.addEventListener('click', () => {
    listItems.forEach(listItem => {
      listItem.classList.remove('active');
    });
    listItem.classList.add('active');
  });
});

  // fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJ1RqnWMdZ-TIRSA9zlRDLA-I&fields=name,formatted_address,formatted_phone_number,rating&key=AIzaSyClso5DVSDxgLPUu3FwxdmhHHZEyu1hoj4`)
  // .then(response => response.json())
  // .then(data => {
  //   // Do something with the place details
  //   console.log(data);
  // });



function getPlaceData(placeURL){
  let mapData = document.querySelectorAll('[role="dialog"]');
  let insta = document.querySelectorAll('[jstcache="4"]');
  let tester = document.getElementsByClassName("title");
  console.log(tester[0].textContent); 
  console.log(insta[0].textContent);
  console.log(insta[1].textContent);
  console.log(insta[2].textContent);
  console.log(insta[3].textContent);

 // console.log(tester[0].innerHTML);


  
// $.ajax({
//   type: "GET",
//   url: placeURL,
//   dataType: 'jsonp',
//   crossDomain: true,
//   success: function(data) {
//     // data contains the JSON file
//     // you can store the data in a global variable or pass it to a function
//   },
//   error: function(xhr, status, error) {
//     // handle error
//   },
//   complete: function(xhr, status) {
    
//     // this function is called after the request is completed, whether it was successful or not
//     console.log(status);
//   }
// });
  // fetch(placeURL, { mode: 'cors' })
  
  // .then(response => response.json())
  // .then(data => {
  //   // Do something with the place details
  //   console.log(data);
  // });



}


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

            let placeURL = 'https://maps.googleapis.com/maps/api/place/details/json?place_id='+results[0].place_id+'&fields=name,formatted_address,formatted_phone_number,rating&key='+API_KEY;
            getPlaceData(placeURL);
            
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

