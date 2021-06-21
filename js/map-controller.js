'use strict';

import { mapService } from './services/map-service.js'
import { locationService } from './services/location-service.js'
// import { storageService } from './services/storage-service.js'

let gMap;

window.onload = () => {
    initMap()
        .then(() => {
            mapService.getPosition()
                .then((ans) => renderPosition(ans))
        })
        .catch(err => {
            console.log('INIT MAP ERROR:', err);
        })
}

document.querySelector('.my-location-btn').addEventListener('click', onFindMyLocation)

export function initMap() {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('.map'), {
                zoom: 15
            })
            gMap.addListener('click', e => {
                const latCoord = e.latLng.lat();
                const lngCoord = e.latLng.lng();
                console.log('lat:', latCoord, 'lng:', lngCoord);

                let marker = new google.maps.Marker({
                    position: e.latLng,
                    map: gMap,
                    icon: '../assets/imgs/nav.png',
                });
                gMap.setCenter(marker.getPosition())
            })
        })
        .catch(err => {
            console.log('Error to connect GoogleApi:', err);
        })
}

function renderPosition(ans) {

    let location = { lat: ans.coords.latitude, lng: ans.coords.longitude };
    panTo(location.lat, location.lng);
    addMarker(location);

    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: location,
    });
    infoWindow.open(gMap);

    gMap.addListener("click", (mapsMouseEvent) => {
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });

        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        infoWindow.open(gMap);
    });
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        icon: '../assets/imgs/nav.png',
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function onFindMyLocation() {
    console.log('my location');
    mapService.getPosition()
        .then(ans => {
            let location = { lat: ans.coords.latitude, lng: ans.coords.longitude };
            panTo(location.lat, location.lng);
            addMarker(location);
        })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    let elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${secretkey}`;
    // elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${mykey}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

