$(document).ready(function() {
    let queryURL = $("#timeFilter").val();
    createMap(queryURL);

    $("#timeFilter").change(function() {
        let queryURL = $("#timeFilter").val();
        createMap(queryURL);
    })
});

function createMap(queryURL) {
    console.log(queryURL);
    $('#mapParent').empty();
    $('#mapParent').append('<div style="height:846px; width: 100%" id="map"></div>');

    // Define streetmap and darkmap layers
    var streetSatmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var litemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    d3.json(queryURL).then(function(data) {

        // Once we get a response, send the data.features object to the createFeatures function

        var markers = L.markerClusterGroup();
        var circles = [];
        // Define a function we want to run once for each feature in the features array
        // Give each feature a popup describing the place and time of the earthquake
        var earthquakes = data.features;
        earthquakes.forEach(function(quake) {

            if ((quake.geometry.coordinates[1]) && (quake.geometry.coordinates[0])) {
                let popUp = L.marker([+quake.geometry.coordinates[1], +quake.geometry.coordinates[0]]).bindPopup("<h3>" + quake.properties.place + "<h3>Magnitude: " + quake.properties.mag +
                    "</h3><hr><p>" + new Date(quake.properties.time) + "</p>");
                markers.addLayer(popUp);

                let circle = L.circle([+quake.geometry.coordinates[1], +quake.geometry.coordinates[0]], {
                    radius: markerSize(quake.properties.mag),
                    fillColor: circleColor(quake.properties.mag),
                    fillOpacity: .9,
                    color: 'grey',
                    weight: .5
                }).bindPopup("<h3>" + quake.properties.place + "<h3>Magnitude: " + quake.properties.mag +
                    "</h3><hr><p>" + new Date(quake.properties.time) + "</p>");

                circles.push(circle);
            }
        });


        var circleLayer = L.layerGroup(circles);

        //fault line json file found on github from user fraxen
        var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
        d3.json(platesURL).then(function(plateBoundaries) {
            L.geoJSON(plateBoundaries, {
                    color: '#feb236',
                    weight: 2
                })
                .addTo(plateLines);
        });

        var plateLines = L.layerGroup();

        // Define a baseMaps object to hold our base layers
        var baseMaps = {
            "Satellite Map": streetSatmap,
            "Light Map": litemap,
            "Dark Map": darkmap
        };

        // Create overlay object to hold our overlay layer
        var overlayMaps = {
            "Earthquake Clusters": markers,
            "Earthquake Circles": circleLayer,
            "Tectonic Plates": plateLines
        };

        // Create our map, giving it the streetmap and earthquakes layers to display on load
        var myMap = L.map("map", {
            center: [39.833333, -98.583333],
            zoom: 4.7,
            layers: [streetSatmap, markers, plateLines]
        });

        //Adding legend control
        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function(myMap) {

            var div = L.DomUtil.create('div', 'legend'),
                magnitudes = [0, 1, 2, 3, 4, 5],
                labels = ["<p>0-1</p>", "<p>1-2</p>", "<p>2-3</p>", "<p>3-4</p>", "<p>4-5</p>"];

            div.innerHTML += "<h4>Magnitude</h4>"
            for (var i = 0; i < magnitudes.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + circleColor(magnitudes[i] + 1) + '"></i> ' +
                    magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
            }
            return div;


        };
        legend.addTo(myMap);

        // Create a layer control
        // Pass in our baseMaps and overlayMaps
        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);
    });
}

function markerSize(magnitude) {
    return magnitude * 10000;
};

function circleColor(x) {
    var colorFill = ['#82b74b', '#b5e7a0', '#f2e394', '#f2ae72', '#d96459', '#c83349'];
    if (x > 5) {
        return colorFill[5];
    } else if (x > 4) {
        return colorFill[4];
    } else if (x > 3) {
        return colorFill[3];
    } else if (x > 2) {
        return colorFill[2];
    } else if (x > 1) {
        return colorFill[1];
    } else
        return colorFill[0]
};