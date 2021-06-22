
import { utilService } from './util-service.js'
import { mapService } from './map-service.js'
import { storageService } from './storage-service.js'

export const locationService = {
    getLocationsFromStorage,
    searchLocation,
    getLocationsList,
    getCurrLocation,
}

const STORAGE_KEY = 'locationsDB'

let gCurrLocation = {
    id: utilService.makeId(),
    name: 'Tel Aviv-Yafo',
    lat: 32.0852999,
    lng: 34.78176759999999,
    // weather: '30C',
    createdAt: Date.now(),
}

let gLocations = [{
    id: utilService.makeId(),
    name: 'Tel Aviv-Yafo',
    lat: 32.0852999,
    lng: 34.78176759999999,
    // weather: '30C',
    createdAt: Date.now()
}];


mapService.getUserPosition()
    .then(ans => {
        let location = { lat: ans.coords.latitude, lng: ans.coords.longitude };
        return location
    })

console.log('gLocations before before:', gLocations);

function searchLocation(val) {
    return getSearchRes(val)
        .then(res => {
            const { lat, lng } = res.results[0].geometry.location
            gCurrLocation.id = utilService.makeId()
            gCurrLocation.name = val;
            gCurrLocation.lat = lat;
            gCurrLocation.lng = lng;
            gCurrLocation.createdAt = Date.now();

            gLocations.push(gCurrLocation)
            console.log('gLocations after:', gLocations);

            storageService.saveToStorage(STORAGE_KEY, gLocations)
            return gCurrLocation;
        })
        .then(data => {
            return data;
        })
}

function getLocationsFromStorage() {
    const locations = storageService.loadFromStorage(STORAGE_KEY)
    if (!locations || !locations.length) {
        locations === gLocations;
        storageService.saveToStorage(STORAGE_KEY, gLocations);
        return;
    }
}

function getLocationsList() {
    // console.log('getting locations:', gLocations);
    return Promise.resolve(gLocations)
}

function getCurrLocation() {
    // console.log('getting Current Location:', gCurrLocation);
    return Promise.resolve(gCurrLocation)
}

function getSearchRes(term) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${term}&key=${secretkey}`)
        // return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${term}&key=${mykey}`)
        .then(res => res.data)
}