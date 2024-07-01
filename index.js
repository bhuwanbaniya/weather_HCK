//bhuwanbaniya_2414002_weather_app


const form = document.querySelector('form');
const cityInput = document.querySelector('#city');
const cityName = document.querySelector('.city-name');
const temp = document.querySelector('.temp');
const dateElement = document.querySelector('.date');
const weather_description = document.querySelector('.weather-description');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const pressure = document.querySelector('.pressure');
const weatherIcon = document.querySelector('.weather-icon');
const pastDataButton = document.querySelector("#past-data-button");
const pastDataContainer = document.querySelector('.past-data');

const API_KEY = '049a06099f75635728ff7415f72d35bc';

// Set the cityInput value to "Los Angeles"
cityInput.value = 'Los Angeles';

// Save weather data to local storage
function saveWeatherDataToLocalStorage(city, data) {
  const weatherData = {
    city,
    data,
  };
  localStorage.setItem(city, JSON.stringify(weatherData));
}

// Retrieve weather data from local storage
function getWeatherDataFromLocalStorage(city) {
  const weatherDataJSON = localStorage.getItem(city);
  return weatherDataJSON ? JSON.parse(weatherDataJSON) : null;
}

// Update the weather display with saved data
function updateWeatherDisplay(city, data) {
  const {
    main: { temp: temperature, humidity: humidityValue, pressure: pressureValue },
    weather: [{ description }],
    wind: { speed },
    dt: timeValue,
  } = data;

  const weatherIconCode = data.weather[0].icon;
  const date = new Date(timeValue * 1000);

  cityName.textContent = city;
  temp.textContent = `${temperature}°C`;
  weather_description.textContent = description;
  dateElement.textContent = formatDate(date);
  humidity.textContent = `Humidity: ${humidityValue}%`;
  pressure.textContent = `Pressure: ${pressureValue} Pa`;
  wind.textContent = `Wind Speed: ${speed} m/s`;
  weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherIconCode}.png" alt="Weather Icon" >`;
}

// Format the date
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Load weather data for default city (Los Angeles) on page load
window.addEventListener('load', () => {
  const defaultCity = cityInput.value;
  const storedWeatherData = getWeatherDataFromLocalStorage(defaultCity);
  if (storedWeatherData) {
    updateWeatherDisplay(defaultCity, storedWeatherData.data);
  } else {
    fetchWeatherAndDisplay(defaultCity);
  }
});

// Fetch weather data, display it, and save to local storage
function fetchWeatherAndDisplay(city) {
  const storedWeatherData = getWeatherDataFromLocalStorage(city);
  if (storedWeatherData) {
    updateWeatherDisplay(city, storedWeatherData.data);
  } else {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('City not found');
        }
        return response.json();
      })
      .then((data) => {
        updateWeatherDisplay(city, data);
        saveWeatherDataToLocalStorage(city, data);
        saveWeatherDataToDatabase(city, data);
      })
      .catch((error) => {
        console.error(error);
        showErrorMessage('City Not Found');
      });
  }
}

// Show error message
function showErrorMessage(message) {
  cityName.textContent = message;
  temp.textContent = '';
  weather_description.textContent = '';
  dateElement.textContent = '';
  humidity.textContent = '';
  pressure.textContent = '';
  wind.textContent = '';
  weatherIcon.innerHTML = '';
}

// Submit the form to fetch weather data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value;
  fetchWeatherAndDisplay(city);
});
/*
// Save weather data to the local database
function saveWeatherDataToDatabase(city, data) {
  return fetch("database.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ city, data })
  })
  .then(response => response.text())
  .catch(error => {
    console.error("Error saving data to the database:", error);
  });
}
*/
function saveWeatherDataToDatabase(city, data) {
  return fetch("database.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ city, data })
  })
  .then(response => response.text())
  .then(responseText => {
    console.log("Server response:", responseText);
  })
  .catch(error => {
    console.error("Error saving data to the database:", error);
  });
}

// Event listener for "Show Past Data" button
pastDataButton.addEventListener("click", () => {
  pastDataContainer.innerHTML = "Loading past data...";
  const searchedCity = cityInput.value;

  fetch(`past.php?city=${searchedCity}`)
    .then(response => response.text())
    .then(data => {
      pastDataContainer.innerHTML = data;
    })
    .catch(error => {
      pastDataContainer.innerHTML = "Error loading past data.";
      console.error(error);
    });
});
