
import { storageService } from './storage-service.js'

export const weatherService = {
    getWeatherToRender,
}

const STORAGE_KEY = 'weatherDB'
const gLastFetchAt = 15 * 60 * 1000;

function getWeatherToRender(lat, lng) {
    // const weather = storageService.loadFromStorage(STORAGE_KEY)
    // if (weather) return Promise.resolve(weather)
    // if (weather && weather.time + gLastFetchAt > Date.now()) return Promise.resolve(weather)

    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${weatherKey}&units=metric`

    return axios.get(url)
        .then(weather => weather.data)
    // .then(weather => { weather.time = Date.now(); return weather })
    // .then(weather => storageService.saveToStorage(STORAGE_KEY, weather))
}
