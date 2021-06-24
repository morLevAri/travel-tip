
import { utilService } from './util-service.js'
import { mapService } from './map-service.js'
import { storageService } from './storage-service.js'

export const locationService = {
    getLocationsFromStorage,
    saveLocationsToStorage,
    getSearchRes,
    // searchLocation,
    // getCurrLocation,
}

const STORAGE_KEY = 'locationsDB'

// let gCurrLocation = {
//     id: utilService.makeId(),
//     name: 'Tel Aviv-Yafo',
//     lat: 32.0852999,
//     lng: 34.78176759999999,
//     // weather: '30C',
//     createdAt: Date.now()
// }

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

// function searchLocation(val) {
//     return getSearchRes(val)
//         .then(res => {
//             const { lat, lng } = res.results[0].geometry.location
//             gCurrLocation.id = utilService.makeId()
//             gCurrLocation.name = val;
//             gCurrLocation.lat = lat;
//             gCurrLocation.lng = lng;
//             gCurrLocation.createdAt = Date.now();
//             saveLocationsToStorage(gCurrLocation)
//             return gCurrLocation;
//         })
// }


function saveLocationsToStorage(currLocation) {
    gLocations = storageService.loadFromStorage(STORAGE_KEY);
    if (!gLocations) gLocations = [];
    gLocations.push(currLocation);
    storageService.saveToStorage(STORAGE_KEY, gLocations);
}

function getLocationsFromStorage() {
    const locations = storageService.loadFromStorage(STORAGE_KEY)
    if (!locations || !locations.length) {
        locations === gLocations;
        storageService.saveToStorage(STORAGE_KEY, gLocations);
        return;
    }
    return Promise.resolve(locations)
}

// function getCurrLocation() {
//     return Promise.resolve(gCurrLocation)
// }

function getSearchRes(term) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${term}&key=${secretkey}`)
        // return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${term}&key=${mykey}`)
        .then(res => res.data)
}