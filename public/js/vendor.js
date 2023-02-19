const SVNIT = [72.7833, 21.1663];
const LPSavani = [72.78685735866463, 21.19382270200964];
let center = LPSavani;

const userLocation = [];
navigator.geolocation.getCurrentPosition((position) => {
    userLocation.push(position.coords.longitude);
    userLocation.push(position.coords.latitude);
});

// const location = {
//     startinglatitude: userLocation[0],
//     endinglongitude: userLocation[1]
// };

// const newLocation = new Location(location);

// newLocation.save((err) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('Location saved successfully!');
//     }
// });

console.log("USER LOCATION - ", userLocation);

//SettingUp Map Box

mapboxgl.accessToken = 'pk.eyJ1Ijoic3dheWFtLTExIiwiYSI6ImNsZTc0NjlqYTAxeGczdm56dWIyMWdoYnoifQ.2IT1CxUH664iTPiG5zhTpg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 15,
    center: [72.7933, 21.1959]  //Logitude & Lattitude
});
var marker = new mapboxgl.Marker()
    .setLngLat([72.7933, 21.1959])
    .addTo(map);

//Add controller
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-right');

//Add Search Bar
// Add the control to the map.
// map.addControl(
//     new MapboxGeocoder({
//         accessToken: mapboxgl.accessToken,
//         mapboxgl: mapboxgl
//     })
// );

//Add Marker
// const marker = new mapboxgl.Marker({
//     color: "#3e3e3e",
//     draggable: true
//     })
//     .setLngLat(SVNIT)
//     .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("SVNIT"))
//     .addTo(map);
// var mapData={}
// $.ajax({
//     url: "https://data.austintexas.gov/resource/hyed-gvq2.json",
//     type: "GET",
//     data:{
//         "$limit":3,
//         "$$app_token": "Ry4KbXFbyd505huCk04E4X0O1"
//     }}).success(function(data){
//     mapData=(data);

//     var lat =mapData[0].location.latitude;
//     var lon=mapData[0].location.longitude;
//     console.log(lat);
//     console.log(lon);
//     const ll =new mapboxgl.LngLat(lon,lat);
//     console.log(ll);

//     const marker1=new mapboxgl.Marker().setLngLat([12.554729,55.70651])
//     .addTo(map);

//     const petMarker=new mapboxgl.Marker().setLngLat(ll)
//     .addTo(map);
// });

// // Add a marker to the map
// var markers = [
//     {
//         coordinates: [72.7933, 21.1959],
//         title: 'Location 1',
//         description: 'This is location 1'
//     },
//     {
//         coordinates: [90.2033, 40.2900],
//         title: 'Location 2',
//         description: 'This is location 2'
//     },
//     // Add more markers as needed
// ];
// // Loop through the markers array and add each marker to the map
// markers.forEach(function(marker) {
//     // Create a new marker
//     var newMarker = new mapboxgl.Marker()
//         .setLngLat(marker.coordinates)
//         .setPopup(new mapboxgl.Popup({ offset: 25 })
//             .setHTML('<h3>' + marker.title + '</h3><p>' + marker.description + '</p>'))
//         .addTo(map);
// });

    
// //Enabling GEOLOCATE
const geoLocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
})

// map.addControl(geoLocate);

//Connect With DataBase
async function getStores() {
    // let stores = await fetch("/stores", { method: "get" });
    // console.log(stores);
    // stores = await stores.json();

    // Make a search request to the Mapbox Search API

    let searchQuery = null;

    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    });

    // Add the control to the map
    map.addControl(geocoder);

    // Listen for the result event
    geocoder.on('result', async (e) => {
        // Get the search query text
        const searchText = e.result.text;
        searchQuery = searchText

        // Do something with the search text, such as display it to the user
        const cordinates =  await getCoordinates(searchText);
        console.log(cordinates);
        return searchText
    });

    async function getCoordinates(searchText) {
        console.log(searchQuery)
        let stores = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?access_token=${mapboxgl.accessToken}`);

        // Parse the response JSON
        stores = await stores.json();

        // Extract the coordinates of the first search result
        const coordinates = stores.features[0].geometry.coordinates;

        // Log the coordinates to the console
        console.log(`Latitude: ${coordinates[1]}, Longitude: ${coordinates[0]}`);
        return coordinates;

    }




    for (let i = 0; i < stores.length; i++) {

        if (stores[i].storeId == 0) {
            new mapboxgl.Marker({
                color: "#7CFC00",
                draggable: true
            })
                .setLngLat(stores[i].location.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<a href = "/stores/${stores[i]._id}">BOOK</a>`))
                .addTo(map);

        }

        else {
            console.log(stores);
            new mapboxgl.Marker({
                color: "#FF5733",
                // draggable: true
            })
                .setLngLat(stores[i].location.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<a href = "/stores/${stores[i]._id}">BOOK</a>`))
                .addTo(map);
        }

    }
}

getStores();

const reset = document.getElementById("reset");
reset.addEventListener("click", () => {
    fetch("/map/reset", {
        method: "GET"
    });
    window.location.href = "/map";
})

const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-77.032, 38.913]
        },
        properties: {
          title: 'Murder',
          description: 'Washington, D.C.'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.414, 37.776]
        },
        properties: {
          title: 'Robbery',
          description: 'San Francisco, California'
        }
      },
      {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [72.805851,21.172109]
          },
          properties: {
            title: 'Arson',
            description: 'Somewhere'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [72.806165,21.179070]
          },
          properties: {
            title: 'Robbery',
            description: 'here'
          }
        }
    ]
  };
  for (const feature of geojson.features) {
    // var blueMarker = new mapboxgl.Marker({
    //     color: "blue"
    // });
    // var marker;
    // if(feature.properties.title === 'murder')
    // {
    //     marker= blueMarker;
    // }
  // create a HTML element for each feature
  const el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
      )
  ).addTo(map);
}




// import geojson from "./data";
// mapboxgl.accessToken = 'pk.eyJ1Ijoic3dheWFtLTExIiwiYSI6ImNsZTc0NjlqYTAxeGczdm56dWIyMWdoYnoifQ.2IT1CxUH664iTPiG5zhTpg';
//   var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v11',
//     center: [72.8311,21.1702],
//     zoom: 12
//   });

//   map.addControl(
//     new MapboxGeocoder({
//     accessToken: mapboxgl.accessToken,
//     mapboxgl: mapboxgl
//     })
//     );

//   const geojson = {
//   type: 'FeatureCollection',
//   features: [
//     {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [-77.032, 38.913]
//       },
//       properties: {
//         title: 'Murder',
//         description: 'Washington, D.C.'
//       }
//     },
//     {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [-122.414, 37.776]
//       },
//       properties: {
//         title: 'Robbery',
//         description: 'San Francisco, California'
//       }
//     },
//     {
//         type: 'Feature',
//         geometry: {
//           type: 'Point',
//           coordinates: [72.805851,21.172109]
//         },
//         properties: {
//           title: 'Arson',
//           description: 'Somewhere'
//         }
//       },
//       {
//         type: 'Feature',
//         geometry: {
//           type: 'Point',
//           coordinates: [72.806165,21.179070]
//         },
//         properties: {
//           title: 'Robbery',
//           description: 'here'
//         }
//       }
//   ]
// };



// console.log(geojson.features.length);
// const a = [0,0,0,0,0];
// // add markers to map
// for (const feature of geojson.features) {
//     console.log(feature.properties.title);
//     if(feature.properties.title === 'Murder')
//     {
//         a[0]++;
//         console.log(`a[0] is ${a[0]}`);
//     }
//     else if(feature.properties.title === 'Arson')
//     {
//         a[1]++;
//         console.log(`a[1] is ${a[1]}`);
//     }
//     else if(feature.properties.title === 'DUI')
//     {
//         a[2]++;
//         console.log(`a[2] is ${a[2]}`);
//     }
//     else if(feature.properties.title === 'Robbery')
//     {
//         a[3]++;
//         console.log(`a[3] is ${a[3]}`);
//     }
//     else if(feature.properties.title === 'hackathon')
//     {
//         a[4]++;
//         console.log(`a[4] is ${a[4]}`);
//     }
//     // var blueMarker = new mapboxgl.Marker({
//     //     color: "blue"
//     // });
//     // var marker;
//     // if(feature.properties.title === 'murder')
//     // {
//     //     marker= blueMarker;
//     // }
//   // create a HTML element for each feature
//   const el = document.createElement('div');
//   el.className = 'marker';

//   // make a marker for each feature and add to the map
//   new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates)
//   .setPopup(
//     new mapboxgl.Popup({ offset: 25 }) // add popups
//       .setHTML(
//         `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
//       )
//   ).addTo(map);
// }
// document.getElementById('murders').innerHTML = `The number of murders is ${a[0]}`;
// document.getElementById('robbery').innerHTML = `The number of robberies is ${a[3]}`;
// document.getElementById('arson').innerHTML = `The number of arson counts is ${a[1]}`;
// document.getElementById('dui').innerHTML = `The number of DUI is ${a[2]}`;
// document.getElementById('hack').innerHTML = `The number of hackathons is ${a[4]}`;

// var geocoder = new MapboxGeocoder({ // Initialize the geocoder
//     accessToken: mapboxgl.accessToken, // Set the access token
//     mapboxgl: mapboxgl, // Set the mapbox-gl instance
//     marker: false, // Do not use the default marker style
//     placeholder: 'Search for places in Sri Lanka', // Placeholder text for the search bar
//     bbox: [79.0000, 5.0000, 82.0000, 10.0000], // Sri lanka 
//     proximity: {
//       longitude: -122.25948,
//       latitude: 37.87221
//     } 
//   });