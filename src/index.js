import './scss/style.scss';
import { async } from 'q';

const API_KEY = '3df9465bacaddb460ad6f26f2a256db2';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather?units=metric';
const API_IMG_URL = 'http://openweathermap.org/img/wn/';
const API_NEXTWEEK_URL = 'https://api.openweathermap.org/data/2.5/forecast?units=metric';
let API_COUNTRY_CODE = 'pl';

const UNITS = {
  pressure: 'hPa',
  humidity: '%',
  wind: 'km/h',
  temperature: '°C'
};

const DOW = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
};

const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
};

const searchForm = document.querySelector('#search');

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
};

const handleErrorResponse = error => {
  console.error(error);
};

const registerListeners = () => {
  searchForm.addEventListener('submit', onSearchSubmit);
  displayDateAndTime();
};

const onSearchSubmit = async event => {
  event.preventDefault();

  const data = new FormData(event.target);
  const city = data.get('city');

  await fetchWeatherData(city);
  await fetchNextWeekWeatherData(city);
};

const fetchWeatherData = async city => {
  try {
    const request = await fetch(`${API_URL}&q=${city}&APPID=${API_KEY}`);
    const response = await request.json();

    if (response.cod !== 200) {
      handleErrorResponse();
    } else {
      API_COUNTRY_CODE = response.sys['country'].toLowerCase();
      displayWeather(response);
    }
  } catch (exception) {
    // TODO: Handle fetch error (ex. Cannot connect to the remote host)
  }
};

const displayWeather = function(data) {
  DOM.cityName.innerHTML = data.name;
  DOM.weatherDesc.innerHTML = data.weather[0].description;
  DOM.temp.innerHTML = Math.round(data.main.temp) + ` ${UNITS.temperature}`;
  DOM.tempMin.innerHTML = Math.round(data.main.temp_min) + ` ${UNITS.temperature}`;
  DOM.tempMax.innerHTML = Math.round(data.main.temp_max) + ` ${UNITS.temperature}`;
  DOM.pressure.innerHTML = data.main.pressure + ` ${UNITS.pressure}`;
  DOM.humidity.innerHTML = Math.round(data.main.humidity) + ` ${UNITS.humidity}`;
  DOM.wind.innerHTML = data.wind.speed + ` ${UNITS.wind}`;
  DOM.icon.src = getWeatherImageURL(data.weather[0].icon);
};

const getWeatherImageURL = iconID => {
  return `${API_IMG_URL}${iconID}@2x.png`;
};

const fetchNextWeekWeatherData = async city => {
  try {
    const requestUrl = `${API_NEXTWEEK_URL}&q=${city},${API_COUNTRY_CODE}&APPID=${API_KEY}`;
    const request = await fetch(requestUrl);
    const response = await request.json();

    if (response.cod != 200) {
      handleErrorResponse();
    } else {
      displayNextWeekWeather(response);
    }
  } catch (exception) {
    // TODO: Handle fetch error (ex. Cannot connect to the remote host)
  }
};

const displayNextWeekWeather = (fetchedData, countryCode) => {
  let nextDays = document.querySelector('.next-days');
  // listOfStates is a list with 3 hour updates
  let listOfStates = fetchedData.list;
  // for the next 5 days, I will take only some data from this list mostly, by some data I mean data with interval = step * (i + 1), it could be e.g. 21 hours interval
  let step = Math.floor(listOfStates.length / 5) - 1;

  nextDays.innerHTML = ''; // empty the box for nextWeekWeather
  let tomorrow = new Date();
  for (let i = 0; i < 5; i++) {
    tomorrow.setDate(tomorrow.getDate() + 1);
    nextDays.innerHTML += createSampleDay(
      listOfStates[(i + 1) * step],
      DOW[tomorrow.getDay()],
      tomorrow.getDay() + 1,
      months[tomorrow.getMonth()]
    ); // second parameter takes current day + (i + 1) and returns the result % 7, e.g. if current day = monday, then the for loop will return five next days -> tuesday, wedensday... and so on
  }
};

const createSampleDay = function(certainDayData, whatDayOfWeek, whatDayOfMonth, whatMonth) {
  return `
      <div class="sample-day">
        <div class="dow-and-weather-pic">
          <div class="hl-text">${whatDayOfWeek}</div>
          <div>${whatDayOfMonth} ${whatMonth}</div>
          <img src="${getWeatherImageURL(certainDayData.weather[0].icon)}" width="96px" height="96px"">
          </div>
          <div class="min-max-temp">
            <p class="temp">Temp. MIN ${Math.round(certainDayData.main.temp_min) + ` ${UNITS.temperature}`}</p>
            <p class="temp">Temp. MAX ${Math.round(certainDayData.main.temp_max) + ` ${UNITS.temperature}`}</p>
          </div>
        </div>
      </div>
  `;
};

const displayDateAndTime = function() {
  setInterval(function() {
    let currentDate = new Date();
    let date =
      ('0' + currentDate.getDate()).slice(-2) +
      '.' +
      ('0' + (currentDate.getMonth() + 1)).slice(-2) +
      '.' +
      currentDate.getFullYear();

    let time = currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours();
    time += ':';
    time += currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes();

    let dow = DOW[currentDate.getDay()];

    let datetime = dow + ', ' + date + '<br>' + time;
    DOM.dateAndTime.innerHTML = datetime;
  }, 1000);
};

// invoke main function

registerListeners();
