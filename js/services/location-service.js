
import { utilService } from './util-service.js'
import { mapService } from './map-service.js'
import { storageService } from './storage-service.js'

export const locationService = {
    removeLoc,
    saveLocationsToStorage,
    getLocationsFromStorage,
    getSearchRes,
}

const STORAGE_KEY = 'locationsDB'

let gLocations = [{
    id: utilService.makeId(),
    name: 'Tel Aviv-Yafo',
    lat: 32.0852999,
    lng: 34.78176759999999,
    weather: 32.5,
    createdAt: Date.now()
}];

mapService.getUserPosition()
    .then(ans => {
        let location = { lat: ans.coords.latitude, lng: ans.coords.longitude };
        return location
    })

function removeLoc(id) {
    const idx = gLocations.findIndex((location) => {
        return location.id === id
    })
    gLocations.splice(idx, 1);
    storageService.saveToStorage(STORAGE_KEY, gLocations)
}

function saveLocationsToStorage(currLocation) {
    gLocations = storageService.loadFromStorage(STORAGE_KEY);
    if (!gLocations) gLocations = [];
    gLocations.unshift(currLocation);
    storageService.saveToStorage(STORAGE_KEY, gLocations);
}

function getLocationsFromStorage() {
    let locations = storageService.loadFromStorage(STORAGE_KEY)
    if (!locations || !locations.length) {
        locations === gLocations;
        locations = gLocations;
        storageService.saveToStorage(STORAGE_KEY, gLocations);
    }
    return Promise.resolve(locations)
}

function getSearchRes(term) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${term}&key=${secretkey}`)
        // return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${term}&key=${mykey}`)
        .then(res => res.data)
}

