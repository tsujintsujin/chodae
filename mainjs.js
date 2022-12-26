const listItems = document.querySelectorAll('nav .nav-item');


listItems.forEach(listItem => {
    listItem.addEventListener('click', () => {
        listItems.forEach(listItem => {
            listItem.classList.remove('active');
        });
        listItem.classList.add('active');
    });
});


function initMap(){
    // Map options
    let options = {
      zoom:8,
      center:{lat:7.356033977636596,lng:125.85744918370949}
    }
    // New map
    let map = new google.maps.Map(document.getElementById('map'), options);

    // Listen for click on map
    google.maps.event.addListener(map, 'click', function(event){
      // Add marker
      addMarker({coords:event.latLng});
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
    let markers = [
      {
        coords:{lat:42.4668,lng:-70.9495},
        iconImage:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        content:'<h1>Lynn MA</h1>'
      },
      {
        coords:{lat:42.8584,lng:-70.9300},
        content:'<h1>Amesbury MA</h1>'
      },
      {
        coords:{lat:42.7762,lng:-71.0773}
      }
    ];

    // Loop through markers
    for(let i = 0;i < markers.length;i++){
      // Add marker
      addMarker(markers[i]);
    }

    // Add Marker Function
    function addMarker(props){
      let marker = new google.maps.Marker({
        position:props.coords,
        map:map,
        //icon:props.iconImage
      });

      // Check for customicon
      if(props.iconImage){
        // Set icon image
        marker.setIcon(props.iconImage);
      }

      // Check content
      if(props.content){
        let infoWindow = new google.maps.InfoWindow({
          content:props.content
        });

        marker.addListener('click', function(){
          infoWindow.open(map, marker);
        });
      }
    }
  }

  window.onload = function () {
    initMap()
  };