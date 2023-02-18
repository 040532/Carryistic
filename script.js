// var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

// mapboxgl.accessToken = 'pk.eyJ1Ijoic3dheWFtLTExIiwiYSI6ImNsZTc2NWZwNjAyajIzb2w4dng4MjEyYTkifQ.c4_jbZWs6izA3wNa_v5Tgw';
// var map = new mapboxgl.Map({
//   container: 'map',
//   style: 'mapbox://styles/mapbox/streets-v11' 
  
// });
mapboxgl.accessToken = 'pk.eyJ1Ijoic3dheWFtLTExIiwiYSI6ImNsZTc0NjlqYTAxeGczdm56dWIyMWdoYnoifQ.2IT1CxUH664iTPiG5zhTpg';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [-74.5, 40], // starting position
        zoom: 9 // starting zoom
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());