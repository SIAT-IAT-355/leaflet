// create a map in the "#map" div, set the view to a given place and zoom
async function loadChart() {
  const geojsonData = await d3.json("data/countries.geo.json");
  const sleepHours = await d3.csv("data/country_sleep_hours.csv");

  // create a map between country and sleep hours
  const sleepHoursMap = new Map();

  sleepHours.forEach((d) => {
    sleepHoursMap.set(d.country, d.sleep_hours);
  });

  // get the extent of sleep hours
  const sleepHoursExtent = d3.extent(sleepHours, (d) => d.sleep_hours);

  // create a color scale
  const colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain(sleepHoursExtent);

  // create a function to get the fill color of a country
  function getFillColor(country) {
    const sleepHours = sleepHoursMap.get(country);
    return colorScale(sleepHours);
  }

  function style(feature) {
    console.log(feature.properties.name);
    return {
      fillColor: getFillColor(feature.properties.name),
      weight: 2,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  }

  // set center and zoom on world center and zoom level
  var map = L.map("map2").setView([0, 0], 2);

  // add an OpenStreetMap tile layer then add it to map
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.geoJson(geojsonData, { style: style }).addTo(map);
}

loadChart();
