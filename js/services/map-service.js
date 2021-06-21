'use strict';

// import { storageService } from './services/storage-service.js'

export const mapService = {
    getPosition,
}

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}
