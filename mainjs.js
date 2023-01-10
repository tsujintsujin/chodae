const listItems = document.querySelectorAll('nav .nav-item');
const API_KEY = 'AIzaSyClso5DVSDxgLPUu3FwxdmhHHZEyu1hoj4';
let map, map2, map3;
let lati, longi, loc_title, loc_address, coordinates, geocoder;
let satbtn, input, autocomplete, intervalSearch;
let windowOpen = false;
let partTitle, partAddress;
let panTo = document.getElementById("pan-to");
let mapMarker = document.getElementById("mapMarker");
let removeMarker = document.getElementById("remove-marker");
let Explore = document.getElementById('Explore');
let expSect = document.getElementById('exploreSection');
let close = document.querySelectorAll('[class="gm-ui-hover-effect"]');
let googleLabel;
let googleLabelStatus = true;
let template = document.createElement('btn');
let userMarkers = [];
let userMarkerContent = {};
let markerContent = '';
let latlng;
let currentMarker;

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
    strictBounds: false
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

function setCurrentMarker(marker){
  currentMarker = marker;
}
removeMarker.addEventListener("click", function () {
  currentMarker.setMap(null);

//remove from object array
delete  userMarkerContent[`${currentMarker.position.lat()}, ${currentMarker.position.lng()}`]

console.log(userMarkerContent);
});


mapMarker.addEventListener("click", function () {
  if (windowOpen === true) {
    markThis(coordinates, map2);
  } else {
    alert("None selected, can't add marker here.");
  }
});


function markThis(latlng, map2) {
  let marker = new google.maps.Marker({
    position: latlng,
    map: map2
  });

  userMarkerContent[`${latlng.lat}, ${latlng.lng}`] = markerContent;
  markerContent = '';
  marker.addListener('click', function () {
    //window content pls
    
    closePreviousWindow();

    let lat = marker.position.lat();
    let lng = marker.position.lng();
    latlng = { lat: lat, lng: lng };
    map2.panTo(latlng);

    let winContent = userMarkerContent[`${latlng.lat}, ${latlng.lng}`]
    let infoWindow = new google.maps.InfoWindow({
      content: winContent
    });
    infoWindow.open(map2, marker);
    setCurrentMarker(marker);

    console.log(latlng);
  });


  userMarkers.push(latlng);
  let unique = [...new Set(userMarkers)];
  userMarkers = unique;
  console.log(userMarkers);

}

function getPlaceData() {

  partAddress = document.querySelectorAll('[jstcache="4"]');
  partTitle = document.getElementsByClassName("title");
  googleLabel = document.querySelectorAll('[jstcache="6"]');
  let Title = '';
  if (partTitle[0] ? Title = partTitle[0].textContent : '')

    if (markerContent == "") {
      markerContent += `<b>${Title}</b>`;
      for (let i = 0; i < partAddress.length; i++) {
        let tempCheck = partAddress[i].textContent;
        if (tempCheck.includes('+') ? '' : markerContent += `<br>${tempCheck}`);
      }
    }


  if (googleLabel[0] ? googleLabel[0].remove() : '');

  try {
    loc_title = partTitle[0].textContent;
    loc_address = `${partAddress[1].textContent} ${partAddress[2].textContent} ${partAddress[3].textContent}`;
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
  try {

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


    panTo.addEventListener("click", function () {
      latlng = new google.maps.LatLng(7.177371073399362, 125.72633743286133);
      map2.setZoom(12);
      map2.panTo(latlng);
    });


    // Listen for click on map
    google.maps.event.addListener(map2, 'click', function (event) {
      //closing previous window
      closePreviousWindow();
      // Add marker
      let lat = event.latLng.lat();
      let lng = event.latLng.lng();

      geocoder = new google.maps.Geocoder;
      latlng = { lat: lat, lng: lng };
      console.log(latlng);
      mapShowLocationDetails(geocoder, latlng);


    });





  } catch {
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



function searchPan() {


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



function closePreviousWindow() {
  if (document.querySelectorAll('[class="gm-ui-hover-effect"]')[0]) {
    winClose = document.querySelectorAll('[class="gm-ui-hover-effect"]')[0].click()
  }
}

function mapShowLocationDetails(geocoder, latlng) {
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











