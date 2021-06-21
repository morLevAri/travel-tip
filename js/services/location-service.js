'use strict';

import { utilService } from './util-service.js'
import { mapService } from './map-service.js'
import { storageService } from './storage-service.js'

export const locationService = {
    searchLocation,
    getLocations,
}

const STORAGE_KEY = 'locationsDB'

let gLocations = [];
let gCurrLocation = {};

function getSearchRes(term) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${term}&key=${secretkey}`)
        // return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${term}&key=${mykey}`)
        .then(res => res.data)
}

mapService.getMyPosition()
    .then(ans => {
        let location = { lat: ans.coords.latitude, lng: ans.coords.longitude };
        return location
    })

function searchLocation(val) {
    return getSearchRes(val)
        .then(res => {
            gCurrLocation.id = utilService.makeId()
            gCurrLocation.searchTerm = val;
            gCurrLocation.results = res.results;
            gCurrLocation.createdAt = Date.now();
            saveLocationsToStorage(gCurrLocation);
            return gCurrLocation;
        })
        .then(data => {
            return data;
        })
}

function saveLocationsToStorage(currLocation) {
    gLocations = storageService.loadFromStorage(STORAGE_KEY);
    if (!gLocations) gLocations = [];
    gLocations.unshift(currLocation);
    storageService.saveToStorage(STORAGE_KEY, gLocations);
}

function getLocations() {
    let lastLocations = storageService.loadFromStorage(STORAGE_KEY);
    if (!lastLocations) {
        console.log('no last locations');
        return Promise.resolve(gLocations)
    }
    else {
        return Promise.resolve(lastLocations)
    }
}
