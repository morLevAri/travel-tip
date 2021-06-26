
import { mapService } from './services/map-service.js'
import { locationService } from './services/location-service.js'
// import { calcController } from './calc-controller.js'
import { utilService } from './services/util-service.js'

let gGoogleMap;

let gCurrLocation = {
    id: utilService.makeId(),
    name: 'Tel Aviv-Yafo',
    lat: 32.0852999,
    lng: 34.78176759999999,
    // weather: '30C',
    createdAt: Date.now()
}

window.onload = () => {
    // calcController.initCurrs()
    // document.querySelector('.convert-btn').addEventListener('click', calcController.onConvert)
    initMap()
        .then(() => {
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
            gGoogleMap.addListener('click', ev => {
                const latCoord = ev.latLng.lat();
                const lngCoord = ev.latLng.lng();
                onPickPlace(latCoord, lngCoord)

                new google.maps.Marker({
                    position: ev.latLng,
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

function renderLocationsTable() {
    locationService.getLocationsFromStorage()
        .then(locations => {
            const strHTML = locations.map(location => {
                return `
                <li class="location">
                <button class= "go-to-location-btn go-to-loc-${location.id}"><i class="fas fa-map-marker-alt"></i></button>
                <button class= "delete-btn del-loc-${location.id}"><i class="far fa-trash-alt"></i></button>
                <p>${location.name}</p>
                </li>
                `
            }).join('')

            document.querySelector('.locations-list').innerHTML = strHTML;
            return locations
        })
        .then(locations => {
            locations.forEach(location => {
                document.querySelector(`.go-to-loc-${location.id}`).addEventListener('click', () => {
                    onGoBtn(location)
                })
                document.querySelector(`.del-loc-${location.id}`).addEventListener('click', () => {
                    onRemoveLoc(location.id);
                })
            })
        })
}

function renderPosition() {
    const position = { lat: gCurrLocation.lat, lng: gCurrLocation.lng };
    panTo(position);
    addMarker(position);
}

function onSearchLocation(ev) {
    ev.preventDefault();
    let elInput = document.querySelector('input[name=search-input]');
    gCurrLocation.name = elInput.value;

    locationService.getSearchRes(elInput.value)
        .then(res => {
            const { lat, lng } = res.results[0].geometry.location
            updateCurrLocation(lat, lng)
            return gCurrLocation;
        })
        .then(location => {
            panTo(location)
            addMarker(location);
            renderLocationsTable()
        })
    updateSpan(elInput.value)
    elInput.value = '';
    return
}

function onPickPlace(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    const latlng = {
        lat,
        lng,
    }
    geocoder.geocode({ location: latlng })
        .then((response) => {
            let locationAddress = response.results[0].formatted_address
            gCurrLocation.name = locationAddress;
            updateCurrLocation(lat, lng)
            renderLocationsTable()
            updateSpan(locationAddress)
            return gCurrLocation;
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e))
}

function updateCurrLocation(lat, lng) {
    gCurrLocation.lat = lat
    gCurrLocation.lng = lng
    gCurrLocation.id = utilService.makeId()
    gCurrLocation.createdAt = Date.now();
    locationService.saveLocationsToStorage(gCurrLocation)
    return gCurrLocation;
}

function onGoBtn(location) {
    panTo(location)
    addMarker(location);
    updateSpan(location.name)
}

function onRemoveLoc(id) {
    locationService.removeLoc(id)
    renderLocationsTable()
}

function updateSpan(locationName) {
    document.querySelector('.curr-loc-span').innerHTML = locationName;
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
            panTo(position);
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


