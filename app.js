const form = document.querySelector('form');
const input = document.querySelector('input');
const error = document.querySelector('.error');
const loadingImage = document.querySelector('.loading');
const results = document.querySelector('.results');

loadingImage.style.display = 'none';

// "id": 5371607214194688,
// "weather_state_name": "Heavy Rain",
// "weather_state_abbr": "hr",
// "wind_direction_compass": "SE",
// "created": "2020-06-19T18:50:07.923121Z",
// "applicable_date": "2020-06-19",
// "wind_speed": 4.617331622550969,
// "wind_direction": 144.48045780231146,
// "air_pressure": 1015.5,
// "humidity": 54,
// "visibility": 12.580591843633183,
// "predictability": 77

// Relative formatting?? From Doc:
// "tomorrow" = (new Intl.RelativeTimeFormat('en', { numeric: 'auto' })).format(Math.ceil((new Date('2020-06-20') - Date.now()) / 864e5), 'day')

function getDayCard(day) {
  return `
  <div class="weather-card">
    <h1>${day.applicable_date}</h1>
    <img src="https://www.metaweather.com/static/img/weather/${day.weather_state_abbr}.svg">
    <p><span class="label">Average:</span> <span class="value">${day.the_temp.toFixed(2)}°C</span></p>
    <p><span class="label">Min:</span> <span class="value">${day.min_temp.toFixed(2)}°C</span></p>
    <p><span class="label">Max:</span> <span class="value">${day.max_temp.toFixed(2)}°C</span></p>
  </div>
  `;
}

async function getWeather(name) {
  results.innerHTML = '';
  const response = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${name}`);
  const json = await response.json();
  const [location] = json;
  if (location) {
    const response2 = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${location.woeid}`);
    const json2 = await response2.json();
    if (json2.consolidated_weather) {
      let html = '';
      json2
        .consolidated_weather
        // eslint-disable-next-line no-return-assign
        .forEach((day) => html += getDayCard(day));
      results.innerHTML = html;
    } else {
      error.textContent = 'Error getting forecast data';
    }
  } else {
    error.textContent = 'Location not found';
  }
  loadingImage.style.display = 'none';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const location = input.value;
  if (!location) {
    error.textContent = 'You must enter a location';
  } else {
    loadingImage.style.display = '';
    error.textContent = '';
    getWeather(location);
  }
});
