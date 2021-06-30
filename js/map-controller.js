
import { mapService } from './services/map-service.js'
import { locationService } from './services/location-service.js'
import { weatherService } from './services/weather-service.js'
import { utilService } from './services/util-service.js'

let gGoogleMap;

let gCurrLocation = {
    id: utilService.makeId(),
    name: 'Tel Aviv-Yafo',
    lat: 32.0852999,
    lng: 34.78176759999999,
    weather: 32.5,
    createdAt: Date.now()
}

window.onload = () => {
    initMap()
        .then(() => {
            renderLocationsTable()
            renderPosition()
            showWeather()
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
                const lat = ev.latLng.lat();
                const lng = ev.latLng.lng();
                onPickPlace(lat, lng)
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

function showWeather() {
    const lat = gCurrLocation.lat;
    const lng = gCurrLocation.lng;
    weatherService.getWeatherToRender(lat, lng)
        .then(data => {
            gCurrLocation.weather = data.main.temp;
            return {
                description: data.weather[0].description,
                mainTemp: data.main.temp,
                minTemp: data.main.temp_min,
                maxTemp: data.main.temp_max,
                wind: data.wind.speed,
                icon: data.weather[0].icon,
            }
        })
        .then(renderWeather)
}

function renderWeather(weather) {
    const strHTML =
        `                
        <h2>Weather today</h2>
        <p>mainTemp:${weather.mainTemp}</p>
        <p>minTemp:${weather.minTemp}</p>
        <p>maxTemp:${weather.maxTemp}</p>
        <p>wind:${weather.wind}</p>
        <h2>description:${weather.description}</h2>
        <img src="http://openweathermap.org/img/wn/${weather.icon}@2x.png" alt=""/>
        `
    document.querySelector('.weather-container').innerHTML = strHTML;
    return weather
}

function renderLocationsTable() {
    locationService.getLocationsFromStorage()
        .then(locations => {
            const strHTML = locations.map(location => {
                return `
                <li class="location">
                <button class= "go-to-location-btn go-to-loc-${location.id}"><i class="fas fa-map-marker-alt"></i></button>
                <button class= "delete-btn del-loc-${location.id}"><i class="far fa-trash-alt"></i></button>
                <p title="${location.lat}, ${location.lng}">${location.name}</p>
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
    let locationName = elInput.value;
    locationService.getSearchRes(elInput.value)
        .then(res => {
            const { lat, lng } = res.results[0].geometry.location
            updateCurrLocation(lat, lng, locationName)
            return gCurrLocation;
        })
        .then(location => {
            panTo(location)
            addMarker(location);
            renderLocationsTable()
        })
    updateSpan(locationName)
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
        .then((res) => {
            let locationAddress = res.results[0].formatted_address
            updateCurrLocation(lat, lng, locationAddress)
            renderLocationsTable()
            updateSpan(locationAddress)
            return gCurrLocation;
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e))
}

function updateCurrLocation(lat, lng, locationName) {
    gCurrLocation.id = utilService.makeId()
    gCurrLocation.name = locationName
    gCurrLocation.lat = lat
    gCurrLocation.lng = lng
    gCurrLocation.createdAt = Date.now();
    showWeather()
    locationService.saveLocationsToStorage(gCurrLocation)
    return Promise.resolve(gCurrLocation)
}

function onGoBtn(location) {
    updateCurrLocation(location.lat, location.lng, location.name)
    panTo(location)
    addMarker(location);
    updateSpan(location.name)
}

function onRemoveLoc(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            locationService.removeLoc(id)
            renderLocationsTable()
        }
    })
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
    mapService.getUserPosition()
        .then(ans => {
            let position = { lat: ans.coords.latitude, lng: ans.coords.longitude };
            updateCurrLocation(position.lat, position.lng, 'My Location')
            panTo(position);
            addMarker(position);
            updateSpan('My Location');
            renderLocationsTable();
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
