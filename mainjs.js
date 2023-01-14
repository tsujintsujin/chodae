const listItems = document.querySelectorAll('nav .nav-item');
const API_KEY = 'AIzaSyClso5DVSDxgLPUu3FwxdmhHHZEyu1hoj4';
let map, map2;
let lati, longi, loc_title, loc_addressHold = "", loc_address, coordinates, geocoder, titleDisplay;
let satbtn, input, autocomplete, intervalSearch;
let windowOpen = false;
let partTitle, partAddress;
let panTo = document.getElementById("pan-to");
let mapMarker = document.getElementById("mapMarker");
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
const Users = {};
let carouselItemContainer = document.getElementById('items-carousel');
let addressContainer = document.getElementById('addressContainer');
let locationTitle = document.getElementById('locationTitle');
let tester = document.getElementById('testbtn');
let global_latlng;


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
  delete userMarkers[`${currentMarker.position.lat()}, ${currentMarker.position.lng()}`]
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
  userMarkers.forEach(checkDupe);

  if (document.querySelectorAll('[class="gm-ui-hover-effect"]')[0]) {

    if (locExisting === false) {

      markThis(global_latlng, map2);
      console.log('marked');
      // console.log(userMarkers)
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

  // console.log(loc_title);
  // console.log(loc_address);
  // console.log(userMarkerContent);
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

    console.log(titleDisplay[0]);
    let winContent = titleDisplay[0];

    // loop placeAddressArray



    locationTitle.innerHTML = winContent;

    let infoWindow = new google.maps.InfoWindow({
      content: winContent
    });
    infoWindow.open(map2, marker);
    currentMarker = marker;


    changeWithMarkerContent();




  });


  userMarkers.push(global_latlng);
  const key = 'lat';
  const unique = [...new Map(userMarkers.map(item =>
    [item[key], item])).values()];
  userMarkers = unique;
}



function getPlaceData(geocodeData) {


  let titleNode = document.createElement('h3');
  titleNode.classList.add("fw-bold");
  partAddress = document.querySelectorAll('[jstcache="4"]');
  partTitle = document.getElementsByClassName("title");
  googleLabel = document.querySelectorAll('[jstcache="6"]');
  let Title = '';

  // title
  // address  

  //full address no id
  let placeAddressArray = geocodeData.formatted_address.split(", ");
  if (placeAddressArray[0].includes('+')) {
    placeAddressArray.splice(0, 1);
  }


  // remove all children of addressContainer

  if (partTitle[0] != undefined) {
    while (addressContainer.children.length > 1 && addressContainer.lastChild) {
      addressContainer.removeChild(addressContainer.lastChild);
    }

    Title = partTitle[0].textContent;
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

    // console.log(geocodeData);

    // console.log(loc_title);
    // console.log(loc_addressHold);

  } catch (e) {
    loc_title = "None selected";
    loc_addressHold = "None selected";
    if (e instanceof TypeError) {
      windowOpen = false;
    }
  }

  if (loc_title != "None selected" ? windowOpen = true : '');
  markerContent = ""; 

}

function changeWithMarkerContent() {

  while (addressContainer.children.length > 1 && addressContainer.lastChild) {
    addressContainer.removeChild(addressContainer.lastChild);
  }
  for (let i = 0; i < titleDisplay.length; i++) {
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


          removeCarouselItems();

          //scrape info window, get place details will be taken from service, do this later
          //some locations have no data in places api so I need to scrape it here
          let placeId = results[0].place_id;

          getPlaceData(results[0]);

          if (windowOpen ? getService(placeId) : '');

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
  let request = {
    placeId: placeId
  };
  service = new google.maps.places.PlacesService(map2);

  service.getDetails(request, function (place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      let i = 0;
      if (place.photos) {

        while (i < place.photos.length) {
          placePhotos.push(place.photos[i].getUrl());
          let isActive = '';
          if (i === 1 ? isActive = 'active' : '');
          let carouselItem = `<div class="carousel-item rounded-2 ${isActive}">
                            <div class="img-fit rounded-2"
                              style="background-image: url(${place.photos[i].getUrl()});">
                            </div>
                          </div>`
          carouselItemContainer.innerHTML += carouselItem;
          i++;
        }
      } else {
        console.log("No photo references");
      }



      // console.log(place);
      // console.log("");
      // console.log(place.adr_address); // dont use
      // console.log("");
      // console.log(place.name); // dont use
      // console.log("");
      // console.log(place.rating);
      // console.log("");
      // console.log(place.reviews); 
      // console.log("");
      // console.log(place.formatted_address); // dont use
      // console.log("");
      // console.log(place.current_opening_hours); 
      // console.log("");
      // console.log(place.formatted_phone_number);














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