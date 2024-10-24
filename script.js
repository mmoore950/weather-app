const input = document.querySelector('input')
input.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const [currentData, forecasts] = await getData()
    updateDisplay(currentData, forecasts)
  }})
async function getData() {
  const location = input.value 
  const data = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?unitGroup=metric&elements=datetime%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecipprob%2Cpreciptype%2Cwindspeed%2Ccloudcover%2Cconditions&include=days%2Chours%2Ccurrent&key=G84UEVV95EH4UNWHQ53QRVY9M&contentType=json`)
  const dataJSON = await data.json()

  console.log(dataJSON)
  
  const currentWeather = {
    address: dataJSON.resolvedAddress,
    time: dataJSON.currentConditions.datetime,
    temp: celsiusToFahrenheit(dataJSON.currentConditions.temp),
    humidity: Math.round(dataJSON.currentConditions.humidity),
    conditions: dataJSON.currentConditions.conditions,
    feelsLike: celsiusToFahrenheit(dataJSON.currentConditions.feelslike),
    wind: Math.round(dataJSON.currentConditions.windspeed)
  }
  return [currentWeather, dataJSON.days]
}



const currConditions = document.getElementById('conditions')
const address = document.getElementById('address')
const currTemp = document.getElementById('temp')
const feelsLike = document.getElementById('feels-like')
const currWind = document.getElementById('wind')
const currHumidity = document.getElementById('humidity')

const forecastDiv = document.getElementById('forecast-div')
function updateDisplay(currentWeather, forecasts) {
  currConditions.textContent = currentWeather.conditions.toUpperCase()
  address.textContent = currentWeather.address.toUpperCase()
  currTemp.textContent = currentWeather.temp
  feelsLike.textContent = `FEELS LIKE: ${currentWeather.feelsLike}`
  currWind.textContent = `WIND: ${currentWeather.wind}`
  currHumidity.textContent = `HUMIDITY: ${currentWeather.humidity}%`

  forecastDiv.innerHTML = ''
  for (let i = 0; i < 7; i++) {
    createForecast(forecasts[i])
  }
}

async function setDefault() {
  const warwickData = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${'Warwick NY'}/next7days?unitGroup=metric&elements=datetime%2Cname%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Chumidity%2Cprecipprob%2Cpreciptype%2Cwindspeed%2Ccloudcover%2Cconditions&include=days%2Chours%2Ccurrent&key=G84UEVV95EH4UNWHQ53QRVY9M&contentType=json`)
  const warwickJSON = await warwickData.json()
  const warwickConditions = {
    address: warwickJSON.resolvedAddress,
    time: warwickJSON.currentConditions.datetime,
    temp: celsiusToFahrenheit(warwickJSON.currentConditions.temp),
    humidity: Math.round(warwickJSON.currentConditions.humidity),
    conditions: warwickJSON.currentConditions.conditions,
    feelsLike: celsiusToFahrenheit(warwickJSON.currentConditions.feelslike),
    wind: Math.round(warwickJSON.currentConditions.windspeed)
  }
  updateDisplay(warwickConditions, warwickJSON.days)
}

function celsiusToFahrenheit(temp) {
  return Math.round(temp * 9/5 + 32)
}
setDefault()

function createForecast(dayInfo) {
  const forecast = document.createElement('div')
  forecast.className = 'forecast'
  const date = document.createElement('h1')
  date.className = 'forecast-name'
  const conditions = document.createElement('h2')
  conditions.className = 'forecast-conditions'

  const tempInfo = document.createElement('div')
  tempInfo.className = 'forecast-temp'
  const lowTemp = document.createElement('h2')
  lowTemp.className = 'forecast-temp-info'
  const highTemp = document.createElement('h2')
  highTemp.className = 'forecast-temp-info'
  const feelsLike = document.createElement('h2')
  feelsLike.className = 'forecast-temp-info'

  date.textContent = formatDate(dayInfo.datetime)
  conditions.textContent = dayInfo.conditions
  lowTemp.textContent = `Low: ${celsiusToFahrenheit(dayInfo.tempmin)}`
  highTemp.textContent = `High: ${celsiusToFahrenheit(dayInfo.tempmax)}`
  feelsLike.textContent = `Feels Like: ${celsiusToFahrenheit(dayInfo.temp)}`

  forecast.appendChild(date)
  forecast.appendChild(conditions)
  
  tempInfo.appendChild(lowTemp)
  tempInfo.appendChild(highTemp)
  tempInfo.appendChild(feelsLike)
  forecast.appendChild(tempInfo)
  forecastDiv.appendChild(forecast)
}

function formatDate(dateString) {
  const date = new Date(dateString); // Convert string to Date object

  const options = { month: 'long' }; 
  const month = new Intl.DateTimeFormat('en-US', options).format(date);

  const day = date.getDate();
  const daySuffix = getDaySuffix(day);

  return `${month} ${day}${daySuffix}`;
}

function getDaySuffix(day) {
  if (day >= 11 && day <= 13) return 'th'; // Special cases for 11, 12, 13
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}