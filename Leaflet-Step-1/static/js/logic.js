// Creating a map object
var myMap = L.map("map", {
  center: [40.7608, -111.8910],
  zoom: 6
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function generateRadius(magnitude) {
  return magnitude * 3
}

function generateColor(depth) {
  switch (true) {
    case depth <= -10:
      return "#00FF00";
    case depth <= 10:
      return "#ADFF2F";
    case depth <= 30:
      return "#FFFF00";
    case depth <= 50:
      return "#FFA500";
    case depth <= 70:
      return "#FF6347";
    case depth <= 90:
      return "#FF0000";
      case depth >= 90:
      return "#FF0000";
    default:
      return "#7CFC00";
  }

}

function onEachFeature(popup) {
  popup.bindPopUp("<h3>" + popup.features.properties.place +
    "</h3><hr><p>" + new Date(popup.features.properties.time) + "</p>");
}

// Getting our GeoJSON data
d3.json(link).then(function (data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    // onEachFeature: onEachFeature,
    pointToLayer: function (earthquake, latlong) {
      //console.log(latlong);
      return L.circleMarker(latlong);
    },
    style: function (earthquake, latlong) {
      return {
        color: '#1c1c1c',
        fillColor: generateColor(earthquake.geometry.coordinates[2]),
        opacity: 0.6,
        fillOpacity: 0.8,
        radius: generateRadius(earthquake.properties.mag)
      }
    },
    onEachFeature: function (earthquake, popup) {
      popup.bindPopup("Magnitude:" + earthquake.properties.mag + "<br>Depth:" + earthquake.geometry.coordinates[2] +"<br>Location:" + earthquake.properties.place);

    }
  }).addTo(myMap);

  // Creating the legend for bubble color based on depth
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Depth</strong>'],
    // categories = [10, 8, 6, 4, 2];
    categories = [-10,10,30,50,70,90];

    for (var i = 0; i < categories.length; i++) {
      div.innerHTML += 
      labels.push(
        '<i class="circle" style="background:' + generateColor(categories[i]) + '"></i> ' +
        (categories[i] ? categories[i] : '+'));
      
    }
    div.innerHTML = labels.join('<br>');
    return div;
  };

  legend.addTo(myMap);

});