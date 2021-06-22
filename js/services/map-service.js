
// import { storageService } from './services/storage-service.js'

export const mapService = {
    getUserPosition,
}

function getUserPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}
