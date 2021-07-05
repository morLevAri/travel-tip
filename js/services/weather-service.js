
export const weatherService = {
    getWeatherToRender,
}

function getWeatherToRender(lat, lng) {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${weatherKey}&units=metric`
    return axios.get(url)
        .then(weather => weather.data)
}
