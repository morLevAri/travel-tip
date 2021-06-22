
import { mapService } from './services/map-service.js'
import { locationService } from './services/location-service.js'
import { storageService } from './services/storage-service.js'
import { calcController } from './calc-controller.js'

let gGoogleMap;

window.onload = () => {
    calcController.initCurrs()
    document.querySelector('.convert-btn').addEventListener('click', calcController.onConvert)

    initMap()
        .then(() => {
            locationService.getLocationsFromStorage()
            renderLocationsTable()
            renderPosition()
        })
        .catch(err => {
            console.log('INIT MAP ERROR:', err);
        })
    document.querySelector('.location-nav').addEventListener('submit', onSearchLocation)
    document.querySelector('.user-location-btn').addEventListener('click', onFindUserLocation)
}


export function initMap() {
    return _connectGoogleApi()
        .then(() => {
            gGoogleMap = new google.maps.Map(
                document.querySelector('.map'), {
                zoom: 15
            })
            gGoogleMap.addListener('click', e => {
                const latCoord = e.latLng.lat();
                const lngCoord = e.latLng.lng();
                console.log('lat:', latCoord, 'lng:', lngCoord);

                new google.maps.Marker({
                    position: e.latLng,
                    map: gGoogleMap,
                    icon: '../assets/imgs/nav.png',
                });
            })
            return gGoogleMap
        })
        .catch(err => {
            console.log('Error to connect GoogleApi:', err);
        })
}

function renderPosition() {
    locationService.getCurrLocation()
        .then(currPos => {
            const position = { lat: currPos.lat, lng: currPos.lng };
            panTo(position.lat, position.lng);
            addMarker(position);
        })
}

function onSearchLocation(ev) {
    ev.preventDefault();
    let elInput = document.querySelector('input[name=search-input]');
    locationService.searchLocation(elInput.value)
    // .then(location => {
    //     const locations = locationService.getLocationsList();
    //     const { lat, lng } = location.results[0].geometry.location
    //     panTo(lat, lng)
    //     return locations
    // })
    // .then(locations => { renderLocationsTable(locations) })

    // document.querySelector('.curr-loc-span').innerHTML = elInput.value;
    // elInput.value = '';
}

function renderLocationsTable() {
    locationService.getLocationsList()
        .then(locations => {
            const strHTML = locations.map(location => {
                return `<li class="location"><p>${location.name}</p>
                <button class= "go-to-location-btn go-to-loc-${location.id}"><i class="fas fa-map-marker-alt"></i></button>
                <button class= "delete-btn del-loc-${location.id}"><i class="far fa-trash-alt"></i></button>
                `
            }).join('')
            document.querySelector('.locations-list').innerHTML = strHTML;
        })

}


function onGoBtn(ev) {
    console.log(ev.target);
}

function addMarker(loc) {
    let marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        icon: '../assets/imgs/nav.png',
    });
    return marker;
}

function panTo(lat, lng) {
    let laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}

function onFindUserLocation() {
    console.log('my location');
    mapService.getUserPosition()
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

