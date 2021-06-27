import { weatherService } from './services/weather-service.js'

export const weatherController = {
    initWeather,
    onRenderWeather,
    renderWeather,
}

function initWeather() {
    Promise.resolve(onRenderWeather())
}

function onRenderWeather() {
    weatherService.getWeatherToRender()
        .then(renderWeather)
}

function renderWeather(weather) {
    const strHTML =
        `                
        <h2>Weather today</h2>
        <p>${weather.main.temp}</p>
        <h2>${weather.weather[0].description}</h2>
        <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt=""/>
        `
    document.querySelector('.weather-container').innerHTML = strHTML;
    return weather
}
