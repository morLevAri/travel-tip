
export const storageService = {
    saveToStorage,
    loadFromStorage,
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
    // return value
}

function loadFromStorage(key) {
    let val = localStorage.getItem(key)
    return JSON.parse(val)
}
