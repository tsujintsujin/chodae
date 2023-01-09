const listItems = document.querySelectorAll('nav .nav-item');
const API_KEY = 'AIzaSyClso5DVSDxgLPUu3FwxdmhHHZEyu1hoj4';
let map, map2, map3;
let lati ,longi, loc_title, loc_address, coordinates;
let satbtn, input, autocomplete, infowindow, infowindowContent, intervalSearch;
let windowOpen = false;
let tester = document.getElementsByClassName("title");
let butt = document.getElementById("butt");
let marker = document.getElementById("marker");
const Explore = document.getElementById('Explore');
const expSect = document.getElementById('exploreSection');
let insta = document.querySelectorAll('[jstcache="4"]');
let close = document.querySelectorAll('[class="gm-ui-hover-effect"]');
let template = document.createElement('btn');

function addSearch() {
  template = document.createElement('btn');
  template.innerHTML =
    `
    <div class="gm-style-mtc mapAdds">
      <input id="searchInput" type="search" class="searchBar" placeholder="Search"/>
    </div>
  `
  satbtn = document.querySelectorAll('[role="menubar"]');
  satbtn[0].insertAdjacentElement('beforeend', template);
    const opts = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
      types: ["establishment"],
    };
    input = document.getElementById("searchInput");
    autocomplete = new google.maps.places.Autocomplete(input, opts);
    searchPan();
}


listItems.forEach(listItem => {
  listItem.addEventListener('click', () => {
    listItems.forEach(listItem => {
      listItem.classList.remove('active');
    });
    listItem.classList.add('active');
    let activeID = listItem.getAttribute('id');
    switch (activeID) {
      case 'MyList':
        document.getElementById('myListSection').scrollIntoView();
        clearInterval(intervalSearch);
        break;
      case 'Explore':
        document.getElementById('exploreSection').scrollIntoView();
        intervalSearch = setInterval(function () {
          if (document.getElementById('searchInput')) {
          } else {
            addSearch();
          }
        }, 2000);
        break;
      case 'Budget':
        document.getElementById('budgetSection').scrollIntoView();
        clearInterval(intervalSearch);
        break;
      default:
        console.log('Search Empty');
    }
  });
});

marker.addEventListener("click", function () {
  if (windowOpen === true) {
    markThis(coordinates, map2);
  } else {
    alert("None selected, can't add marker here.");
  }
});


function markThis(latlng, map2) {
  const marker = new google.maps.Marker({
    position: latlng,
    map: map2,
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

  if (loc_title != "None selected") {

    windowOpen = true;
  } else {

  }
}


function initMap() {
try{

  const marked = document.getElementById("marked");

  // marked.addEventListener('click', function (e) {
  //   new google.maps.Marker({
  //     position: e.latLng,
  //     map: map
  //   });
  // });


  // Map initial location
  let options = {
    zoom: 10,
    center: { lat: 7.356033977636596, lng: 125.85744918370949 },
    draggable: false,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
  }
  let options2 = {
    zoom: 8,
    center: { lat: 7.356033977636596, lng: 125.85744918370949 },
    scrollwheel: true,
    fullscreenControl: false,
    disableDoubleClickZoom: true
  }

  // New maps
  map = new google.maps.Map(document.getElementById('map'), options);
  map2 = new google.maps.Map(document.getElementById('map2'), options2);
  map3 = new google.maps.Map(document.getElementById('map3'), options);


  butt.addEventListener("click", function () {
    let latLng = new google.maps.LatLng(7.177371073399362, 125.72633743286133);
    map2.setZoom(12);
    map2.panTo(latLng);
  });


  // Listen for click on map
  google.maps.event.addListener(map2, 'click', function (event) {
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

}catch{
  initMap();
}

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

function searchPan(){


    autocomplete.bindTo("bounds", map2);

    infowindow = new google.maps.InfoWindow();
    infowindowContent = document.getElementById("infoWindowDiv");
    console.log(infowindowContent);

    const marker = new google.maps.Marker({
      map2,
      anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);

      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map2.fitBounds(place.geometry.viewport);
      } else {
        map2.setCenter(place.geometry.location);
        map2.setZoom(12);
      }


      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      //  infowindowContent.children["place-name"].textContent = place.name;
      //  infowindowContent.children["place-address"].textContent =
      // place.formatted_address;
      //   infowindow.open(map2, marker);
    });

  }







window.onload = function () {
  //  window.scrollTo(0, 0);

  setTimeout(() => {

  
    try {
      satbtn[0].insertAdjacentElement('beforeend', template);
    } catch {
      initMap();
    }


  }, 2000);

};











