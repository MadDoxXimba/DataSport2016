"use strict";

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FtZWJpcmJ5IiwiYSI6IkwwUXRVY28ifQ.ksZug_5n6Zyr-N0EqjfL9Q';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gamebirby/cilnjnjif0035c4kncaeq95ex',
    center: [-1.54,47.4],
    zoom: 8
});

map.addControl(new mapboxgl.Navigation());

var bouton_menu = document.getElementById('recentrer');
bouton_menu.addEventListener("click",function (e) {
    map.flyTo({
            center: [-1.54,47.248],
            zoom: 8
        });
});

map.on('style.load', function () {
    /////////////// CHARGEMENT DES POINTS /////////////////////
    map.addSource("markers", association);
    map.addLayer({
        "id": "markers",
        "type": "symbol",
        "interactive": true,
        "source": "markers",
        "layout": {
            "icon-image": "{marker-symbol}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top",
            "icon-allow-overlap": true
        }
    });
    ///////////// FIN CHARGEMENT DES POINTS ///////////////////
    
    ///////////// CHARGEMENT DES CONTOURS DE LA LOIRE ATLANTIQUE //////////////////////
    var data_loire_atlantique = {
        "type":"geojson"
    };
    data_loire_atlantique.data = loire_atlantique;
    map.addSource("loire",data_loire_atlantique);
    map.addLayer({
        'id': 'contours',
        'type': 'line',
        'source': 'loire',
        'source-layer': 'contour',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#2e2818',
            'line-width': 2
        }
    });
    ///////////// FIN CHARGEMENT DES CONTOURS DE LA LOIRE ATLANTIQUE ///////////////////  
    
    /////////////////// CHARGEMENT DES CLUBS PERRREINS ////////////////////
    map.addSource("markers_p", perein);
    map.addLayer({
        "id": "markers_p",
        "type": "symbol",
        "interactive": true,
        "source": "markers_p",
        "layout": {
            "icon-image": "{marker-symbol}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top",
            "icon-allow-overlap": true
        }
    });
    /////////////////// CHARGEMENT DES CLUBS PERRREINS ////////////////////
});

map.on('moveend', function () {

    var centre = map.getCenter();

    if (centre.lng > 0.35 || centre.lng < -3 || centre.lat > 48 || centre.lat < 46.3 ){
        map.flyTo({
            center: [-1.54,47.248],
            zoom: 8.5
        });
    }

});

var popup = new mapboxgl.Popup();
/*
map.on('mousemove', function (e) {
    map.featuresAt(e.point, {
        radius: 7.5
    },function (err, features){
        console.log(features);
        document.getElementById('menu').innerHTML = JSON.stringify(features, null, 2);

    });
});*/

var zoom = 8;

/*
map.on('click', function (e) {
    map.featuresAt(e.point, {
        radius: 7.5
    },function (err, features){
        if (zoom < 50) {
            zoom += 1;
        }
        console.log(e.lngLat.lng , e.lngLat.lat);
        map.flyTo({
            center: [e.lngLat.lng , e.lngLat.lat],
            zoom: getZoom()+1
        });
    });
});
*/
//addLayer('Pays de la Loire', 'contours');
//addLayer('Clubs', 'markers');

function addLayer(name, id) {
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = name;

    link.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(id, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(id, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(id, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}

var rechercher = document.getElementById('rechercher');
rechercher.addEventListener('click',function () {
    var contenu = document.getElementById('contenu_rechercher').value;
    for (var i=0; i<association.data.features.length ; i++){
        if (association.data.features[i].properties.title == contenu){
            map.flyTo({
                center: [association.data.features[i].geometry.coordinates[0], association.data.features[i].geometry.coordinates[1]],
                zoom: 15
            });
        }
    }
    
});

map.on('click', function (e) {
    map.featuresAt(e.point, {
        radius: 7.5, // Half the marker size (15px).
        includeGeometry: true,
        layer: 'markers'
    }, function (err, features) {

        if (err || !features.length) {
            popup.remove();
            return;
        }

        var feature = features[0];

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(feature.geometry.coordinates)
            .setHTML(feature.properties.description)
            .addTo(map);
    });
});

map.on('mousemove', function (e) {
    map.featuresAt(e.point, {
        radius: 7.5, // Half the marker size (15px).
        layer: 'markers'
    }, function (err, features) {
        map.getCanvas().style.cursor = (!err && features.length) ? 'pointer' : '';
    });
});


