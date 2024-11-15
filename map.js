// map.js

// Initialize the Vancouver Map
function initializeVancouverMap() {
  console.log("Initializing Vancouver Map");

  // Create a map centered on Vancouver with a zoom level of 13
  const map = L.map("map1").setView([49.2827, -123.1207], 13);

  // Add OpenStreetMap tile layer
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Define Vancouver city boundary polygon (rough approximation)
  const vancouverBoundary = [
    [49.3165, -123.2247], // Northwest corner
    [49.3165, -123.0236], // Northeast corner
    [49.1985, -123.0236], // Southeast corner
    [49.1985, -123.2247], // Southwest corner
  ];

  // Add polygon to the map
  const boundaryPolygon = L.polygon(vancouverBoundary, {
      color: "green",
      fillColor: "#98fb98",
      fillOpacity: 0.3,
    })
    .addTo(map)
    .bindPopup("Vancouver City Boundary");

  // Add marker for Downtown Vancouver
  const downtownMarker = L.marker([49.2827, -123.1207])
    .addTo(map)
    .bindPopup("Downtown Vancouver")
    .openPopup();

  // Add circle for Stanley Park area
  const stanleyParkCircle = L.circle([49.3043, -123.1443], {
      color: "blue",
      fillColor: "#30a3dc",
      fillOpacity: 0.5,
      radius: 500, // in meters
    })
    .addTo(map)
    .bindPopup("Stanley Park Area");

  // Additional markers data
  const markers = [{
      coords: [49.2635, -123.1381],
      popup: "Granville Island",
    },
    {
      coords: [49.282, -123.1171],
      popup: "Vancouver Art Gallery",
    },
    {
      coords: [49.2583, -123.0896],
      popup: "Science World",
    },
  ];

  // Add additional markers to the map
  markers.forEach((markerInfo) => {
    L.marker(markerInfo.coords)
      .addTo(map)
      .bindPopup(markerInfo.popup);
  });

  // Add polyline from Science World to Stanley Park
  const pathCoordinates = [
    [49.2583, -123.0896], // Science World
    [49.3043, -123.1443], // Stanley Park
  ];

  const pathLine = L.polyline(pathCoordinates, {
      color: "red",
      weight: 4,
      opacity: 0.7,
    })
    .addTo(map)
    .bindPopup("Path from Science World to Stanley Park");

  // Optional: Add a layer control for future scalability
  const overlayMaps = {
    "Vancouver Boundary": boundaryPolygon,
    "Downtown Marker": downtownMarker,
    "Stanley Park Area": stanleyParkCircle,
    "Points of Interest": L.layerGroup(markers.map(m => L.marker(m.coords).bindPopup(m.popup))),
    "Path": pathLine,
  };

  L.control.layers(null, overlayMaps).addTo(map);
}

// Initialize the map when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeVancouverMap);