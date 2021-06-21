'use strict';

import { mapService } from './services/map-service.js'
import { locationService } from './services/location-service.js'
import { storageService } from './services/storage-service.js'

let gMap;

window.onload = () => {
    initMap()
        .then(() => {
            mapService.getMyPosition()
                .then((position) => {
                    renderPosition(position)
                })
        })
        .then(() => {
            locationService.getLocations()
                .then((locations) => {
                    renderLocationsTAble(locations)
                })
        })
        .catch(err => {
            console.log('INIT MAP ERROR:', err);
        })
}

document.querySelector('.location-nav').addEventListener('submit', onSearchLocation)
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
            })
        })
        .catch(err => {
            console.log('Error to connect GoogleApi:', err);
        })
}

function renderPosition(ans) {
    let position = { lat: ans.coords.latitude, lng: ans.coords.longitude };
    panTo(position.lat, position.lng);
    addMarker(position);
}

function onSearchLocation(ev) {
    ev.preventDefault();
    let elInput = document.querySelector('input[name=search-input]');
    locationService.searchLocation(elInput.value)
        .then(location => {
            const locations = locationService.getLocations();
            const { lat, lng } = location.results[0].geometry.location
            panTo(lat, lng)
            renderLocationsTAble(locations)
        })
    document.querySelector('.curr-loc-span').innerHTML = elInput.value;
    elInput.value = '';
}


function renderLocationsTAble(locations) {
    const strHTML = locations.map((location) =>
        `<li class="location"><p>${location}</p></li>
        <button class="go-to-location-btn"><i class="fas fa-bullseye"></i>Go</button>
        <button class="delete-btn"><i class="fas fa-trash"></i>Delete</button>
        `)
    document.querySelector('.locations-list').innerHTML = strHTML.join('');
}

function addMarker(loc) {
    let marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        icon: '../assets/imgs/nav.png',
    });
    return marker;
}

function panTo(lat, lng) {
    let laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function onFindMyLocation() {
    console.log('my location');
    mapService.getMyPosition()
        .then(ans => {
            let position = { lat: ans.coords.latitude, lng: ans.coords.longitude };
            panTo(position.lat, position.lng);
            addMarker(position);
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

