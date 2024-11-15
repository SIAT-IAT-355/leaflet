// geojson.js

// Initialize the choropleth map
async function initializeChoroplethMap() {
  console.log("Initializing Choropleth Map");

  try {
    // Load GeoJSON data and sleep hours data concurrently
    const [geojsonData, sleepHoursData] = await Promise.all([
      d3.json("data/countries.geo.json"),
      d3.csv("data/country_sleep_hours.csv"),
    ]);

    // Create a map of country to sleep hours
    const sleepHoursMap = new Map();
    sleepHoursData.forEach((d) => {
      sleepHoursMap.set(d.country, +d.sleep_hours); // Convert to number
    });

    // Determine the extent of sleep hours for the color scale
    const sleepHoursExtent = d3.extent(sleepHoursData, (d) => +d.sleep_hours);

    // Create a color scale
    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateYlGnBu)
      .domain(sleepHoursExtent);

    // Function to get fill color based on sleep hours
    function getFillColor(country) {
      const sleepHours = sleepHoursMap.get(country);
      return sleepHours ? colorScale(sleepHours) : "#ccc"; // Default color for missing data
    }

    // Style function for GeoJSON features
    function style(feature) {
      return {
        fillColor: getFillColor(feature.properties.name),
        weight: 1,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    }

    // Highlight feature on hover
    function highlightFeature(e) {
      const layer = e.target;

      layer.setStyle({
        weight: 3,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.9,
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      info.update(layer.feature.properties);
    }

    // Reset highlight
    function resetHighlight(e) {
      geojson.resetStyle(e.target);
      info.update();
    }

    // Zoom to feature on click
    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    // Attach listeners to each feature
    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
      layer.bindPopup(`${feature.properties.name}<br>Sleep Hours: ${sleepHoursMap.get(feature.properties.name) || "N/A"}`);
    }

    // Initialize the map centered at [20, 0] with zoom level 2
    const map = L.map("map2").setView([20, 0], 2);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add GeoJSON layer
    const geojson = L.geoJson(geojsonData, {
      style: style,
      onEachFeature: onEachFeature,
    }).addTo(map);

    // Add a legend to the map
    const legend = L.control({
      position: "bottomright"
    });

    legend.onAdd = function (map) {
      const div = L.DomUtil.create("div", "info legend");
      const grades = d3.range(sleepHoursExtent[0], sleepHoursExtent[1], (sleepHoursExtent[1] - sleepHoursExtent[0]) / 5);
      const labels = [];

      // Generate labels with colored squares
      div.innerHTML += "<strong>Sleep Hours</strong><br>";
      grades.forEach((grade, index) => {
        div.innerHTML +=
          `<i style="background:${colorScale(grade)}"></i> ` +
          `${grade.toFixed(1)}${grades[index + 1] ? "&ndash;" + grades[index + 1].toFixed(1) + "<br>" : "+"}`;
      });

      // Add a label for missing data
      div.innerHTML += `<i style="background:#ccc"></i> No Data`;

      return div;
    };

    legend.addTo(map);

    // Control that shows country info on hover
    const info = L.control();

    info.onAdd = function () {
      this._div = L.DomUtil.create("div", "info");
      this.update();
      return this._div;
    };

    // Method to update the control based on feature properties
    info.update = function (props) {
      this._div.innerHTML = props ?
        `<h4>${props.name}</h4><b>Sleep Hours:</b> ${sleepHoursMap.get(props.name) || "N/A"}` :
        "Hover over a country";
    };

    info.addTo(map);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Initialize the choropleth map when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeChoroplethMap);