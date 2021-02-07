//Current Date display
function formatDate(dateParameter) {
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let weekDay = weekDays[dateParameter.getDay()];
  let month = months[dateParameter.getMonth()];

  let date = dateParameter.getDate();
  let hours = dateParameter.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = dateParameter.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  
  return `Last update: ${weekDay}, ${month} ${date}, ${hours}:${minutes}`;
}
let now = new Date();
let dateElement = document.querySelector("#current-date");
dateElement.innerHTML = formatDate (now);


//Function of time conversion for forecast hours

function formatHours (timestamp) {
let date = new Date (timestamp);
let hours = date.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = date.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

  return `${hours}:${minutes}`;
}

//Weather of the searched city

function showWeather (result) {
  let temp = Math.round(result.data.main.temp);
  let windSpeed = Math.round(result.data.wind.speed);
  celsiusTemperature = temp;

  document.querySelector("#city-displayed").innerHTML = result.data.name;
  document.querySelector("#feels-like").innerHTML = `Feels like: ${Math.round(result.data.main.feels_like)}°C`;
  document.querySelector("#temperature").innerHTML = `${temp}`;
  document.querySelector("#weather-description").innerHTML = result.data.weather[0].description;
  document.querySelector("#wind").innerHTML = `Wind: ${windSpeed} m/s`;
  document.querySelector("#humidity").innerHTML = `Humidity: ${result.data.main.humidity}%`;
  document.querySelector("#main-icon").setAttribute ("src", `http://openweathermap.org/img/wn/${result.data.weather[0].icon}@2x.png`);
}

//Forecast for the searched city

function showForecast(result) {
  
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

for (let index = 0; index < 6; index++) {
  forecast = result.data.list[index];
  forecastElement.innerHTML += `
  <div class="col-2">
      <h3>
          ${formatHours(forecast.dt * 1000)}
      </h3>
      <img 
          src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"
          alt="wether icon"
      />
      <div class="weather-forecast-temp">
          <strong>
          ${Math.round(forecast.main.temp)}°C
          </strong> 
      </div>
  </div>
  `
}

}

//Default city weather display

function searchCity (city) {
  let apiKey = "c44c1c027cb5aedabc3d66ae7a76ef48";
  let apiRoot = "https://api.openweathermap.org/data/2.5/";
  let apiTypeWeather = "weather?";
  let apiTypeForecast = "forecast?";
  let apiUrl = `${apiRoot}${apiTypeWeather}q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);

  apiUrl = `${apiRoot}${apiTypeForecast}q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

//Current City display

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-searched").value;

searchCity (city);
}
let searchForm = document.querySelector("#search-form-city");
searchForm.addEventListener("submit", handleSubmit);

//C to F

function displayFahrenheitTemperature (event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32; 
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature (event) {
  event.preventDefault();

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = celsiusTemperature;
}

//Current location weather

function searchLocation (position) {
  let apiKey = "c44c1c027cb5aedabc3d66ae7a76ef48";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndPoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeather);
}

let celsiusTemperature = null;

function currentLocationWeather (event) {
event.preventDefault()
navigator.geolocation.getCurrentPosition (searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener ("click", currentLocationWeather);



let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);


let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

searchCity ("Prague");

