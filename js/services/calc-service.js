
import { storageService } from './storage-service.js'

export const calcService = {
    getRates,
    getCurrsToRender,
    calcRates,
}

const STORAGE_KEY = 'currencyRates'
const gLastFetchAt = 15 * 60 * 1000;

function getRates() {
    const rates = storageService.loadFromStorage(STORAGE_KEY)
    if (rates) return Promise.resolve(rates)
    if (rates && rates.time + gLastFetchAt > Date.now()) return Promise.resolve(rates)
    const url = `http://api.exchangeratesapi.io/v1/latest?access_key=${currKey}`
    return axios.get(url)
        .then(rates => rates.data.rates)
        .then(rates => { rates.time = Date.now(); return rates })
        .then(rates => storageService.saveToStorage(STORAGE_KEY, rates))
}

function getCurrsToRender() {
    return getRates()
        .then(_getCurrs)
}

function _getCurrs() {
    return Promise.resolve(getRates())
        .then(rates => Object.keys(rates))
}

function calcRates(amount, fromCurr, toCurr, carrs) {
    var total = carrs[toCurr] * amount / carrs[fromCurr]
    return Promise.resolve(Number.parseFloat(total).toFixed(4))
}

