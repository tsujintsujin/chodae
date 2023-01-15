const listItems = document.querySelectorAll('nav .nav-item');
const API_KEY = 'AIzaSyClso5DVSDxgLPUu3FwxdmhHHZEyu1hoj4';
let map, map2;
let lati, longi, loc_title, loc_addressHold = "", loc_address, geocoder, titleDisplay;
let satbtn, input, autocomplete, intervalSearch;
let windowOpen = false;
let partTitle, partAddress;
let panTo = document.getElementById("pan-to");
let mapMarker = document.getElementById("mapMarker");
let Explore = document.getElementById('Explore');
let close = document.querySelectorAll('[class="gm-ui-hover-effect"]');
let googleLabel;
let googleLabelStatus = true;
let template = document.createElement('btn');
let userMarkerLocation = [];
let userMarkerContent = {};
let markerContent = '';
let latlng;
let currentMarker;
let service;
const placePhotos = [];
let carouselItemContainer = document.getElementById('items-carousel');
let addressContainer = document.getElementById('addressContainer');
let locationTitle = document.getElementById('locationTitle');
let global_latlng;
let placeRating;
let placeReviews;
let transitTitle, transitAddress;

function addSearch() {
  template = document.createElement('div');
  template.classList.add("gm-style-mtc", "d-flex", "d-flex");
  template.innerHTML = `<input id="searchInput" type="search" class="searchBar" placeholder="Search"/>`;
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
      default:
        intervalSearch = 2000;
    }
  });
});


deleteMarker.addEventListener("click", function () {
  currentMarker.setMap(null);
  //remove marker from array
  delete userMarkerContent[`${currentMarker.position.lat()}, ${currentMarker.position.lng()}`]
  delete userMarkerLocation[`${currentMarker.position.lat()}, ${currentMarker.position.lng()}`]
  // console.log(currentMarker.position.lat());
});



// numbers.forEach(myFunction);

// function myFunction(item) {
//   if(44===item){
//   return 0;
//   }
// }

// marker btn test
mapMarker.addEventListener("click", function () {
  function checkDupe(loc) {
    let latlngKey = global_latlng.lat + ", " + global_latlng.lng;
    if ((latlngKey in userMarkerContent)) {
      locExisting = true;
    }
  }


  let locExisting = false;
  userMarkerLocation.forEach(checkDupe);

  if (document.querySelectorAll('[class="gm-ui-hover-effect"]')[0]) {

    if (locExisting === false) {

      markThis(global_latlng, map2);
    } else {
      console.log("Location already marked.");
    }

  } else {
    console.log("None selected, can't add marker here.");

  }
  locExisting = false;


});

function markThis(latlng, map2) {
  let marker = new google.maps.Marker({
    position: latlng,
    map: map2
  });

  userMarkerContent[`${latlng.lat}, ${latlng.lng}`] = loc_title + loc_address;

  markerContent = '';

  marker.addListener('click', function () {
    closePreviousWindow();

    //  set up for marker
    let lat = marker.position.lat();
    let lng = marker.position.lng();
    latlng = { lat: lat, lng: lng };
    map2.panTo(latlng);
    global_latlng = latlng;
    let titleHolder = userMarkerContent[`${global_latlng.lat}, ${global_latlng.lng}`];
    titleDisplay = titleHolder.split("|");

    let winContent = titleDisplay[0];

    // loop placeAddressArray
    locationTitle.innerHTML = winContent;

    let infoWindow = new google.maps.InfoWindow({
      content: winContent
    });
    infoWindow.open(map2, marker);
    currentMarker = marker;

    changeWithMarkerContent();

    console.log(latlng);
    console.log(loc_address);


    console.log("");


  });

  userMarkerLocation.push(global_latlng);
  const key = 'lat';
  const unique = [...new Map(userMarkerLocation.map(item =>
    [item[key], item])).values()];
  userMarkerLocation = unique;
}



function getPlaceData(geocodeData) {
  let Title = '';
  let titleNode = document.createElement('h3');
  titleNode.classList.add("fw-bold");
  partAddress = document.querySelectorAll('[jstcache="4"]');
  partTitle = document.getElementsByClassName("title");
  googleLabel = document.querySelectorAll('[jstcache="6"]');

  console.log(geocodeData.formatted_address);
  //full address no id
  let placeAddressArray = geocodeData.formatted_address.split(", ");
  
  //remove reference id if existing
  if (placeAddressArray[0].includes('+')) {
    placeAddressArray.splice(0, 1);
  }

  transitTitle = document.getElementsByClassName("transit-title")
// check for transit window
  if(transitTitle[1]){
    Title = transitTitle[1].textContent;
  }else{
    Title = partTitle[0].textContent;
  }


  // remove all children of addressContainer for later setting of text
  if (Title != undefined) {
    while (addressContainer.children.length > 1 && addressContainer.lastChild) {
      addressContainer.removeChild(addressContainer.lastChild);
    }

    locationTitle.innerHTML = Title;
    markerContent = `<b>${Title}</b>`;
  
    if (markerContent != "") {
      for (let i = 0; i < partAddress.length; i++) {
        let tempCheck = partAddress[i].textContent;
        if (!tempCheck.includes('+') && tempCheck != undefined) {

          let textNode = document.createElement('h5');
          textNode.setAttribute("id", "address" + i);
          textNode.innerHTML = tempCheck;
          document.getElementById("addressContainer").appendChild(textNode);

          loc_addressHold += "|" + tempCheck;
        }
      }

      let hr = document.createElement('hr');
      document.getElementById("addressContainer").appendChild(hr);
    }
    loc_address = loc_addressHold;
    loc_addressHold = "";
  }

  if (googleLabel[0] ? googleLabel[0].remove() : '');

  // para san nga ba to???
  // my gad

  try {

    loc_title = partTitle[0].textContent;


  } catch (e) {
    loc_title = "None selected";
    loc_addressHold = "None selected";
    if (e instanceof TypeError) {
      windowOpen = false;
    }
  }

  if (loc_title != "None selected" ? windowOpen = true : '');
  markerContent = "";



  //if location is transit/bus stop



}

function changeWithMarkerContent() {

  while (addressContainer.children.length > 1 && addressContainer.lastChild) {
    addressContainer.removeChild(addressContainer.lastChild);
  }
  for (let i = 1; i < titleDisplay.length; i++) {
    let tempCheck = titleDisplay[i];


    let textNode = document.createElement('h5');
    textNode.setAttribute("id", "address" + i);
    textNode.innerHTML = tempCheck;
    document.getElementById("addressContainer").appendChild(textNode);

  }
  let hr = document.createElement('hr');
  document.getElementById("addressContainer").appendChild(hr);

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


    panTo.addEventListener("click", function () {
      latlng = new google.maps.LatLng(7.177371073399362, 125.72633743286133);
      map2.setZoom(12);
      map2.panTo(latlng);
    });


    // for click on map
    google.maps.event.addListener(map2, 'click', function (event) {
      // close previous window

      //for location clicks on map 
      let lat = event.latLng.lat();
      let lng = event.latLng.lng();
      latlng = { lat: lat, lng: lng };
      global_latlng = latlng;
      geocoder = new google.maps.Geocoder;
      mapShowLocationDetails(geocoder, latlng);
      closePreviousWindow();

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
        if (results[0].place_id) {
          console.log("results fired");



          //scrape info window, get place details will be taken from service, do this later
          //some locations have no data in places api so I need to scrape it here
          let placeId = results[0].place_id;
          console.log(results[0]);
          getPlaceData(results[0]);
          if (windowOpen && results[0]) {
            getService(placeId);
          }



        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    })
}

function removeCarouselItems() {
  while (carouselItemContainer.hasChildNodes()) {
    carouselItemContainer.removeChild(carouselItemContainer.firstChild);
  }
}


function getService(placeId) {
  removeCarouselItems();
  let request = {
    placeId: placeId
  };
  let carouselItem;
  service = new google.maps.places.PlacesService(map2);
  service.getDetails(request, function (place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      if(place.rating){
      // console.log(place.rating);
      }
      if(place.reviews){
        // console.log(place.reviews.length);
      }


      let i = 0;
      if (place.photos) {
        while (i < place.photos.length) {
          placePhotos.push(place.photos[i].getUrl());
          let isActive = '';
          if (i === 1 ? isActive = 'active' : '');
          carouselItem = `<div class="carousel-item rounded-2 ${isActive}">
                            <div class="img-fit rounded-2"
                              style="background-image: url(${place.photos[i].getUrl()});">
                            </div>
                          </div>`
          carouselItemContainer.innerHTML += carouselItem;
          i++;
        }
      } else {
        carouselItem = `<div class="carousel-item rounded-2 active">
        <div class="img-fit rounded-2"
          style="background-image: url(icons/nophotos.svg);">
        </div>
      </div>`

        carouselItemContainer.innerHTML = carouselItem;

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
  }
  windowOpen = false;
}


let tetest = document.getElementById('testbtn');
tetest.addEventListener("click", function () {
  // console.log(windowOpen);

});