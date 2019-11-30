import './scss/style.scss'
import { async } from 'q'

const API_KEY = '3df9465bacaddb460ad6f26f2a256db2'
const API_URL = 'https://api.openweathermap.org/data/2.5/weather?units=metric'
const API_IMG_URL = 'http://openweathermap.org/img/wn/'
const API_NEXTWEEK_URL = 'https://api.openweathermap.org/data/2.5/forecast/daily?units=metric'
const howManyDays = 5;

const UNITS = {
  pressure: 'hPa',
  humidity: '%',
  wind: 'km/h',
  temperature: '°C'
}

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
  icon: document.querySelector('.js--icon'),
  dateAndTime: document.querySelector('.date-box') 
}

const registerListeners = () => {
  searchForm.addEventListener('submit', onSearchSubmit)
  displayDateAndTime();
}

const onSearchSubmit = (event) => {
  event.preventDefault()
  
  const data = new FormData(event.target)
  const city = data.get('city')

  fetchWeatherData(city)
  fetchNextWeekWeatherData(city, howManyDays)
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
  DOM.temp.innerHTML = Math.round(data.main.temp) + ` ${UNITS.temperature}` 
  DOM.tempMin.innerHTML = Math.round(data.main.temp_min) + ` ${UNITS.temperature}` 
  DOM.tempMax.innerHTML = Math.round(data.main.temp_max) + ` ${UNITS.temperature}` 
  DOM.pressure.innerHTML = data.main.pressure + ` ${UNITS.pressure}` 
  DOM.humidity.innerHTML = Math.round(data.main.humidity) + ` ${UNITS.humidity}` 
  DOM.wind.innerHTML = data.wind.speed + ` ${UNITS.wind}` 
  DOM.icon.src = getWeatherImageURL(data.weather[0].icon)
}

const fetchNextWeekWeatherData = async (city, howManyDays) => {
  try {
    const request = await fetch(`${API_NEXTWEEK_URL}&q=${city}&APPID=${API_KEY}&cnt=${howManyDays}`)
    const response = await request.json()

    if (response.cod !== 200) {
      handleErrorResponse()
    } else {
      displayNextWeekWeather(response)
    }
  } catch (exception) {
      // TODO: Handle fetch error (ex. Cannot connect to the remote host)
  }
}

const displayNextWeekWeather = function(data) {
  
}

const displayDateAndTime = function() {
  
  const DOW = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }

  setInterval(function() {
    let currentDate = new Date()
    let date = currentDate.getDate() + "/"
    + (currentDate.getMonth()+1)  + "/" 
    + currentDate.getFullYear()

    let time = currentDate.getHours() < 10 ? "0" + currentDate.getHours() 
    : currentDate.getHours();
    time += ":";
    time +=  currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes()
    : currentDate.getMinutes()

    let dow = DOW[currentDate.getDay()]

    let datetime = dow + ', ' + date + '<br>' + time;
    DOM.dateAndTime.innerHTML = datetime
  }, 1000); 
}

registerListeners()