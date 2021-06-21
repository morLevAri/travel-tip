'use strict';

// import { storageService } from './services/storage-service.js'

export const mapService = {
    getMyPosition,
}

function getMyPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}
