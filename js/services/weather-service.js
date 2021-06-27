
export const weatherService = {
    getWeatherToRender,
}

function getWeatherToRender() {
    const lat = 32.0852999;
    const lng = 34.78176759999999;
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${weatherKey}`

    return axios.get(url)
        .then(weather => {
            return weather.data
        })
}
