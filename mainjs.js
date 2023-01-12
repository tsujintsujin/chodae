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
let service;
let res;
const placePhotos = [];


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
    types: ["establishment"]
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
        if (document.getElementById('searchInput') ? '' : addSearch());
        intervalSearch = setInterval(function () {
          if (document.getElementById('searchInput') ? '' : addSearch());
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

function setCurrentMarker(marker) {
  currentMarker = marker;
}
removeMarker.addEventListener("click", function () {
  currentMarker.setMap(null);
  //remove marker from array
  delete userMarkerContent[`${currentMarker.position.lat()}, ${currentMarker.position.lng()}`]
});

// marker btn test
mapMarker.addEventListener("click", function () {


  if (windowOpen === true && document.querySelectorAll('[class="gm-ui-hover-effect"]')[0]) {
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

    closePreviousWindow();

  //  set up for marker
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
  });
  userMarkers.push(latlng);
  let unique = [...new Set(userMarkers)];
  userMarkers = unique;
}

function getPlaceData() {
  partAddress = document.querySelectorAll('[jstcache="4"]');
  partTitle = document.getElementsByClassName("title");
  googleLabel = document.querySelectorAll('[jstcache="6"]');
  let Title = '';
  if (partTitle[0] ? Title = partTitle[0].textContent : '')
    if (markerContent == "") {
      markerContent += `<b>${Title}</b>`;
      //   for (let i = 0; i < partAddress.length; i++) {
      //     let tempCheck = partAddress[i].textContent;
      //     if (tempCheck.includes('+') ? '' : markerContent += `<br>${tempCheck}`);
      //   }
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

  if (loc_title != "None selected" ? windowOpen = true : '');
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


    // for click on map
    google.maps.event.addListener(map2, 'click', function (event) {
      // close previous window
      closePreviousWindow();
      //for location clicks on map 
      let lat = event.latLng.lat();
      let lng = event.latLng.lng();
      latlng = { lat: lat, lng: lng };
      geocoder = new google.maps.Geocoder;
      mapShowLocationDetails(geocoder, latlng);

    });



  } catch {
    initMap();
  }

}



function searchPan() {

  autocomplete.bindTo("bounds", map2);

  const marker = new google.maps.Marker({
    map2,
    anchorPoint: new google.maps.Point(0, -29),
  });

  autocomplete.addListener("place_changed", () => {

    marker.setVisible(false);

    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // check 
    if (place.geometry.viewport) {
      map2.fitBounds(place.geometry.viewport);
    } else {
      map2.setCenter(place.geometry.location);
      map2.setZoom(12);
    }

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
  });
}



function mapShowLocationDetails(geocoder, latlng) {
  geocoder.geocode({ 'location': latlng },
    function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          //scrape info window, get place details will be taken from service, do this later
          let placeId = results[0].place_id;
          getPlaceData();
          getService(placeId);
          coordinates = latlng;
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    })
}

function getService(placeId) {
  let request = {
    placeId: placeId
  };
  service = new google.maps.places.PlacesService(map2);
  service.getDetails(request, function (place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log(place);
                                                                                    //photos url array here
      let i = 0;
      if (place.photos) {
        while (i < place.photos.length) {
          console.log(place.photos[i].getUrl());
          placePhotos.push(place.photos[i].getUrl());
          i++;
        }
      } else {
        console.log("No photo references");
      }
    } else {
      console.log("Place not found");
    }
  });
}

window.onload = function () {
  //  window.scrollTo(0, 0);
  setTimeout(() => {
    try {
      satbtn[0].insertAdjacentElement('beforeend', template);
    } catch (e) {
      initMap();
    }
  }, 2000);
};

function closePreviousWindow() {
  if (document.querySelectorAll('[class="gm-ui-hover-effect"]')[0]) {
    winClose = document.querySelectorAll('[class="gm-ui-hover-effect"]')[0].click()
    windowOpen = false;
  }
}



