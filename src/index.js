import './scss/style.scss'

const API_KEY = '3df9465bacaddb460ad6f26f2a256db2'
const API_URL = 'https://api.openweathermap.org/data/2.5/weather?units=metric'
const API_IMG_URL = 'http://openweathermap.org/img/wn/'

const searchForm = document.querySelector('#search')

const DOM = {
  cityName: document.querySelector('.js--city-name'),
  weatherDesc: document.querySelector('.js--weather-desc'),
  temp: document.querySelector('.js--current-temp'),
  tempMin: document.querySelector('.js--temp-min'),
  tempMax: document.querySelector('.js--temp-max'),
  pressure: document.querySelector('.js--pressure'),
  humidity: document.querySelector('.js--humidity'),
  wind: document.querySelector('.js--wind'),
  icon: document.querySelector('.js--icon')
}

const registerListeners = () => {
  searchForm.addEventListener('submit', onSearchSubmit)
}

const onSearchSubmit = (event) => {
  event.preventDefault()
  
  const data = new FormData(event.target)
  const city = data.get('city')

  fetchWeatherData(city)
}

const fetchWeatherData = async (city) => {
  try {
    const request = await fetch(`${API_URL}&q=${city}&APPID=${API_KEY}`)
    const response = await request.json()

    if (response.cod !== 200) {
      handleErrorResponse()
    } else {
      displayWeather(response)
    }

  } catch (exception) {
    // TODO: Handle fetch error (ex. Cannot connect to the remote host)
  }
}

const getWeatherImageURL = (iconID) => {
  return `${API_IMG_URL}${iconID}@2x.png`
}

const displayWeather = function(data) {
  DOM.cityName.innerHTML = data.name
  DOM.weatherDesc.innerHTML = data.weather[0].description
  DOM.temp.innerHTML = data.main.temp
  DOM.tempMin.innerHTML = data.main.temp_min
  DOM.tempMax.innerHTML = data.main.temp_max
  DOM.pressure.innerHTML = data.main.pressure
  DOM.humidity.innerHTML = data.main.humidity
  DOM.wind.innerHTML = data.wind.speed
  DOM.icon.src = getWeatherImageURL(data.weather[0].icon)
}

registerListeners()