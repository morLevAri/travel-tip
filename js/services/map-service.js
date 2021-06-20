'use strict';

import { utilService } from './util-service.js'

export const mapService = {
    getLocs: getLocs,
    getPosition: getPosition,
}

// let locs = [{ lat: 32.0749831, lng: 34.9120554 }]
let locs = [{ lat: 11.22, lng: 22.11 }]


function getLocs() {
    return new Promise((resolve) => resolve(locs))
}

function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

