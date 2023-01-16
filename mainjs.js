const listItems = document.querySelectorAll('nav .nav-item');
const API_KEY = 'AIzaSyClso5DVSDxgLPUu3FwxdmhHHZEyu1hoj4';
let map, map2;
let lati, longi, loc_title, loc_addressHold = "", loc_address, geocoder, titleDisplay, placeId, Title;
let satbtn, input, autocomplete, intervalSearch;
let windowOpen = false;
let partTitle, partAddress;
let panTo = document.getElementById("pan-to");
const mapMarker = document.getElementById("mapMarker");
const addtotravellist = document.getElementById("addtotravellist");
let Explore = document.getElementById('Explore');
let mainList = document.getElementById('mainList');
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
let placePhotos = [];
let carouselItemContainer = document.getElementById('items-carousel');
let addressContainer = document.getElementById('addressContainer');
let locationTitle = document.getElementById('locationTitle');
const starSection = document.getElementById('starSection');
const MyList = document.getElementById('MyList');
let global_latlng;
let placeRating;
let placeReviews;
let transitTitle, transitAddress;
let userMarkers = {};
let currentPlace;
let rating = 0;
let reviews = [];
let bucketList = {};
let addbucket = false;
let locExisting = false;





function addSearch() {
  template = document.createElement('div');
  template.classList.add("gm-style-mtc", "d-flex", "d-flex");
  template.innerHTML = `<input id="searchInput" type="search" class="searchBar" placeholder="Search"/>`;
  satbtn = document.querySelectorAll('[role="menubar"]');
  if (satbtn[0]) {
    satbtn[0].insertAdjacentElement('beforeend', template);
  }
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


function deleteMarker() {
  currentMarker.setMap(null);
  //remove marker from array
  delete userMarkers[`${currentMarker.position.lat()}, ${currentMarker.position.lng()}`];
  try {
    delete bucketList[`${currentMarker.position.lat()}, ${currentMarker.position.lng()}`];
  } catch {
    console.log("Marker does not exist on the list");
  }
}





function checkDuplicate(userMarkers, map2, addbucket) {

  let latlngKey = global_latlng.lat + ", " + global_latlng.lng;
  if (addbucket) {
    for (let key in bucketList) {
      if (latlngKey == key) {
        locExisting = true;
        console.log("existing in bucketlist");
      }
    }
  } else {
    tobucket = false;
    for (let key in userMarkers) {
      if (latlngKey == key) {
        locExisting = true;
        console.log("existing in marker");

      }
    }
  }
}


addtotravellist.addEventListener("click", function () {
  tobucket = true;
  locExisting = false;
  checkDuplicate(userMarkers, map2, true);
  if (!locExisting) {
    markThis(latlng, map2, true);
    mapMarker.classList.remove("btn-primary");
    mapMarker.classList.add("btn-danger");
    mapMarker.disabled = false;
    mapMarker.innerHTML = "Remove";
  }
});

// marker btn test
mapMarker.addEventListener("click", function () {
  if (mapMarker.innerHTML === "Remove") {
    deleteMarker();
    closePreviousWindow();
    mapMarker.classList.remove("btn-danger");
    mapMarker.disabled = true;
    addtotravellist.disabled = true;
    addtotravellist.classList.remove("btn-primary");
    mapMarker.innerHTML = "Mark";
  } else {

    locExisting = false;
    checkDuplicate(userMarkers, map2, false);
    if (document.querySelectorAll('[class="gm-ui-hover-effect"]')[0]) {
      if (locExisting === false) {

        markThis(global_latlng, map2, tobucket);
        mapMarker.classList.remove("btn-primary");
        mapMarker.classList.add("btn-danger");
        mapMarker.disabled = false;
        mapMarker.innerHTML = "Remove";
      } else {
        console.log("Location already marked.");
      }
    } else {
      console.log("None selected, can't add marker here.");
    }
    locExisting = false;
  }
});





function markThis(latlng, map2, tobucket) {

  let marker = new google.maps.Marker({
    position: latlng,
    map: map2
  });

  currentMarker = marker;
  userMarkerContent[`${latlng.lat}, ${latlng.lng}`] = loc_title + loc_address;
  markerContent = '';
  userMarkerLocation.push(global_latlng);
  const key = 'lat';
  const unique = [...new Map(userMarkerLocation.map(item =>
    [item[key], item])).values()];
  userMarkerLocation = unique;

  let tempData = {};

  tempData['COORDINATES'] = latlng;
  tempData['ID'] = placeId;
  tempData['TITLE'] = loc_title;
  tempData['ADDRESS'] = loc_address; ``
  tempData['PHOTOS'] = placePhotos;
  tempData['RATING'] = rating;
  tempData['REVIEWS'] = reviews;

  userMarkers[`${latlng.lat}, ${latlng.lng}`] = tempData;

  if (tobucket) {
    bucketList[`${latlng.lat}, ${latlng.lng}`] = tempData;
  }

  placePhotos = [];


  marker.addListener('click', function () {
    closePreviousWindow();
    map2.panTo(latlng);
    let lat = marker.position.lat();
    let lng = marker.position.lng();
    latlng = { lat: lat, lng: lng };
    global_latlng = latlng;
    let markerSelected = userMarkers[`${latlng.lat}, ${latlng.lng}`];
    //  set up for marker
    locationTitle.innerHTML = markerSelected.TITLE;
    // loop placeAddressArray
    let infoWindow = new google.maps.InfoWindow({
      content: markerSelected.TITLE
    });

    infoWindow.open(map2, marker);
    currentMarker = marker;

    changeWithMarkerContent(markerSelected);
    if (markerSelected.PHOTOS != 0) {

      changePhotos(markerSelected.PHOTOS);
    } else {
      carouselItem = `<div class="carousel-item rounded-2 active">
      <div class="img-fit rounded-2"
        style="background-image: url(icons/nophotos.svg);">
      </div>
    </div>`
      carouselItemContainer.innerHTML = carouselItem;
    }
    setStarSection(markerSelected.RATING, markerSelected.REVIEWS);

    mapMarker.classList.remove("btn-primary");
    mapMarker.classList.add("btn-danger");
    mapMarker.disabled = false;
    mapMarker.innerHTML = "Remove";

    addtotravellist.classList.add("btn-primary");
    addtotravellist.disabled = false;

  });
}


function getPlaceData(geocodeData) {
  Title = '';
  let titleNode = document.createElement('h3');
  titleNode.classList.add("fw-bold");
  partAddress = document.querySelectorAll('[jstcache="4"]');
  partTitle = document.getElementsByClassName("title");
  googleLabel = document.querySelectorAll('[jstcache="6"]');

  //full address no id
  let placeAddressArray = geocodeData.formatted_address.split(", ");

  //remove reference id if existing
  if (placeAddressArray[0].includes('+')) {
    placeAddressArray.splice(0, 1);
  }

  transitTitle = document.getElementsByClassName("transit-title")
  // check for transit window
  if (transitTitle[1]) {
    Title = transitTitle[1].textContent;
  } else if (partTitle[0]) {
    Title = partTitle[0].textContent;
  } else {
    // do nothing
  }

  // remove all children of addressContainer for later setting of text
  if (Title.length != 0) {
    while (addressContainer.children.length > 1 && addressContainer.lastChild) {
      addressContainer.removeChild(addressContainer.lastChild);
    }

    locationTitle.innerHTML = Title;
    markerContent = `<b>${Title}</b>`;

    if (markerContent != '') {
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
    loc_address = loc_addressHold.slice(1);
    loc_addressHold = "";

  }
  Title = "";
  if (googleLabel[0] ? googleLabel[0].remove() : '');


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
}


function setStarSection(stars, rev) {

  let starLinePref = `<h5 id="starNumber" class="mt-1 me-2">${stars}</h5>`;
  let starLineContent = "";
  let fullStar = '<img src="icons\\starFull.png" alt="">';
  let halfStar = '<img src="icons\\starHalf.png" alt="">';
  let emptyStar = '<img src="icons\\starEmpty.png" alt="">';

  // amazing hahahah
  if (stars === 0) {
    starLinePref = `<h5 id="starNumber" class="mt-1 me-2">No Ratings</h5></h5>`;
    starLineContent = emptyStar + emptyStar + emptyStar + emptyStar + emptyStar;

  } else {
    let iter = Math.floor(rating);
    let cons = 1;
    let full = iter;
    let emptys;
    let half;
    if (stars % cons != 0) {
      half = 1;
      emptys = 4 - full;
    } else {
      half = 0;
      emptys = 5 - iter;
    }
    for (let i = 1; i <= full; i++) {
      starLineContent += fullStar;
    }
    if (half != 0) {
      starLineContent += halfStar;
    }
    if (emptys != 0) {
      for (let i = 1; i <= emptys; i++) {
        starLineContent += emptyStar;
      }
    }
  }

  starLineContent += `<h5 id="ratingNumber" class="ms-3 mt-1">${rev.length} Reviews</h5>`;
  starLinePref += starLineContent;
  starSection.innerHTML = "";
  starSection.innerHTML = starLinePref;
}


function changeWithMarkerContent(markerSelected) {
  let addressArray = markerSelected.ADDRESS.split("|");

  while (addressContainer.children.length > 1 && addressContainer.lastChild) {
    addressContainer.removeChild(addressContainer.lastChild);
  }

  for (let i = 0; i < addressArray.length; i++) {
    let tempCheck = addressArray[i];
    let textNode = document.createElement('h5');
    textNode.setAttribute("id", "address" + i);
    textNode.innerHTML = tempCheck;
    document.getElementById("addressContainer").appendChild(textNode);
  }
  let hr = document.createElement('hr');
  document.getElementById("addressContainer").appendChild(hr);
}

try {
  function initMap() {
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

      //for location clicks on map 
      let lat = event.latLng.lat();
      let lng = event.latLng.lng();
      latlng = { lat: lat, lng: lng };
      global_latlng = latlng;
      geocoder = new google.maps.Geocoder;
      mapShowLocationDetails(geocoder, latlng);
      closePreviousWindow();
    });
  }
} catch (e) {
  initMap();
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
          //scrape info window, get place details will be taken from service, do this later
          //some locations have no data in places api, need to grab from window dom
          placeId = results[0].place_id;
          getPlaceData(results[0]);
          if (windowOpen && results[0]) {
            getService(placeId);
            mapMarker.classList.add("btn-primary");
            mapMarker.classList.remove("btn-danger");
            addtotravellist.classList.add("btn-primary");
            mapMarker.disabled = false;
            addtotravellist.disabled = false;
            mapMarker.innerHTML = "Mark";
          } else {
            mapMarker.classList.remove("btn-danger");
            mapMarker.classList.remove("btn-primary");
            addtotravellist.classList.remove("btn-primary");
            mapMarker.innerHTML = "Mark";
            mapMarker.disabled = true;
            addtotravellist.disabled = true;
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


function collectPhotoUrl(photos) {
  placePhotos = [];
  let i = 0;
  while (i < photos.length) {
    placePhotos.push(photos[i].getUrl());
    i++;
  }
  changePhotos(placePhotos);
}


function changePhotos(photos) {
  removeCarouselItems();
  let i = 0;
  while (i < photos.length) {
    let isActive = '';
    if (i === 1 ? isActive = 'active' : '');
    carouselItem = `<div class="carousel-item rounded-2 ${isActive}">
                      <div class="img-fit rounded-2"
                        style="background-image: url(${photos[i]});">
                      </div>
                    </div>`
    carouselItemContainer.innerHTML += carouselItem;
    i++;
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
      currentPlace = place;

      if (currentPlace.rating) {
        rating = currentPlace.rating;
      } else {
        rating = 0;
      }
      if (currentPlace.reviews) {
        reviews = currentPlace.reviews;
      } else {
        reviews = [];
      }
      setStarSection(rating, reviews);
      if (place.photos) {
        collectPhotoUrl(place.photos);
      } else {
        carouselItem = `<div class="carousel-item rounded-2 active">
        <div class="img-fit rounded-2"
          style="background-image: url(icons/nophotos.svg);">
        </div>
      </div>`
        carouselItemContainer.innerHTML = carouselItem;
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
    } catch {
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

MyList.addEventListener('click', () => {
  mainList.innerHTML = ""

  console.log(bucketList);
  let accordionConstruct = "";

  let iter = 0;
  for (let key in bucketList) {

    let addressarr = bucketList[key].ADDRESS.split("|");


    console.log(addressarr[0]);

    let addressstr = "";
    for(let i = 0 ; i<addressarr.length; i++){
      addressstr+=`<h6>${addressarr[i]}</h6>`;
    }
  accordionConstruct = `<div class="accordion-item" id="accordionHead${iter}">
	<h2 class="accordion-header" id="flush-heading${iter}">
		<button class="accordion-button collapsed text-dark" type="button"
			data-bs-toggle="collapse" data-bs-target="#${iter}"
			aria-expanded="false" aria-controls="${iter}">
			<h6>${bucketList[key].TITLE}</h6>
		</button>
	</h2>
	<div id="${iter}" class="accordion-collapse collapse"
		aria-labelledby="${iter}" data-bs-parent="#mainList">
		<div id="accordionContent" class="accordion-body">${addressstr}
		</div>
	</div>
</div>`

iter++;
mainList.innerHTML += accordionConstruct;

// if(mainList.innerHTML!=""){

//   mainList.forEach(mainList => {
//     mainList.addEventListener('click', () => {
//       mainList.forEach(mainList => {
//         mainList.classList.remove('active');
//       });
//       mainList.classList.add('active');
//       let activeID = mainList.getAttribute('id');
//       switch (activeID) {
//         case 'MyList':
//           document.getElementById('myListSection').scrollIntoView();
//           clearInterval(intervalSearch);
//           break;
//         case 'Explore':
//           document.getElementById('exploreSection').scrollIntoView();
//           if (document.getElementById('searchInput') ? '' : addSearch());
//           intervalSearch = setInterval(function () {
//             if (document.getElementById('searchInput') ? '' : addSearch());
//           }, 2000);
//           break;
//         default:
//           intervalSearch = 2000;
//       }
//     });
//   });
// }

}


});


