console.log("Hello");

// create a map in the "#map" div, set the view to a given place and zoom
var map = L.map("map1").setView([49.2827, -123.1207], 13);

// add an OpenStreetMap tile layer then add it to map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Add a polygon around the Vancouver city limits (rough approximation)
var polygon = L.polygon(
  [
    [49.3165, -123.2247], // Northwest corner
    [49.3165, -123.0236], // Northeast corner
    [49.1985, -123.0236], // Southeast corner
    [49.1985, -123.2247], // Southwest corner
  ],
  {
    color: "green",
    fillColor: "#98fb98",
    fillOpacity: 0.3,
  }
)
  .addTo(map)
  .bindPopup("Vancouver City Boundary");

// Add a marker at the center of Vancouver
var marker = L.marker([49.2827, -123.1207])
  .addTo(map)
  .bindPopup("Downtown Vancouver")
  .openPopup();

// Add a circle representing an area in Stanley Park
var circle = L.circle([49.3043, -123.1443], {
  color: "blue",
  fillColor: "#30a3dc",
  fillOpacity: 0.5,
  radius: 500, // Radius in meters
})
  .addTo(map)
  .bindPopup("Stanley Park Area");

// Additional markers around Vancouver
var marker1 = L.marker([49.2635, -123.1381])
  .addTo(map)
  .bindPopup("Granville Island");

var marker2 = L.marker([49.282, -123.1171])
  .addTo(map)
  .bindPopup("Vancouver Art Gallery");

var marker3 = L.marker([49.2583, -123.0896])
  .addTo(map)
  .bindPopup("Science World");

var line = L.polyline(
  [
    [49.2732, -123.1037], // Science World coordinates
    [49.3043, -123.1443], // Stanley Park coordinates
  ],
  {
    color: "red",
    weight: 10,
    opacity: 0.7,
  }
)
  .addTo(map)
  .bindPopup("Path from Science World to Stanley Park");
