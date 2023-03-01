const key ="2eb97ba80047a942daf2a2fce44ab380";
let currentKey = '';
const head         = document.querySelector('#head');
const container    = document.querySelector('#main-container');
const navBar       = document.querySelector('#nav-bar');
const input        = document.querySelector('#input');
const searchButton = document.querySelector('#search-city');
const cityList     = document.querySelector('#list-cities');
const cards        = document.querySelector('#cards');
const current      = document.querySelector('#current-weather');
const future       = document.querySelector('#future-weather');



searchButton.addEventListener("click", () => {
  const city = input.value;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    getFiveDayForecast()
  })
  .catch(error => {
    console.log(error);
  });
});


// catches errors
const throwErrors = (res) => {
    if(!res.ok) {
        throw Error(res.statusText)
    }
    return res;
}

// function to fetch current weather
const getCurrentWeather = () => {
    const searchedCity = $('#input').val();
    const units = "imperial";
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&units=${units}&appid=${key}`

    //calls API
    fetch(apiURL)
        .then(throwErrors)
        .then((res) => {
            return res.json();
        })
        // Current Weather conditions
        .then((res) => {
            saveSearchedCity(searchedCity);
            var currentDate = dayjs().format('ddd, MMMM D');
            //fills in HTML based on API res
            let currentHTML = `
            <div id="" class="col p-3">
                    <h2>Current Weather in ${res.name} - ${currentDate} <img src="http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png"></h2>
                    <p><span id="current-temp">Temperature: ${res.main.temp} °F</span></p>
                    <p><span id="current-hum">Humidity: ${res.main.humidity}%</span></p>
                    <p><span id="current-wind">Wind: ${res.wind.speed} mph</span></p>
            </div>
            `;
        $('#current-weather').html(currentHTML);
        })
}


const getFiveDayForecast = () => {
  const searchedCity = $('#input').val();
  const units = "imperial";
  let forecastAPIURL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&units=${units}&appid=${key}`;

  fetch (forecastAPIURL)
  .then((res) => {
      return res.json();
  })
  .then((res) => {
      
      futureHTML = `
      <h2 class="p-2">  Five-Day Forecast:</h2>
      <div id="" class="col d-inline-flex flex-wrap">
      `;

      // loop to get values for each day
      for (let i = 0; i < 5; i++) {
          let futureD = dayjs().add([i], 'day').format('ddd, MMM D')
          let futureDCall = res.list[i];
          let fiveDayIcon = `http://openweathermap.org/img/wn/${futureDCall.weather[0].icon}.png`

          futureHTML += `
              
                  <div id="daily-forecast-card"class="card vw-10 p-3 m-2 text-light">
                      <h3 class="text-center">${futureD} <img src="${fiveDayIcon}" alt="weather"></h3>
                      <p>Temp: <span id="five-day-temp">${futureDCall.main.temp} °F</span></p>
                      <p>Humidity: <span id="five-day-hum">${futureDCall.main.humidity}%</span></p>
                      <p>Wind: <span id="five-day-wind">${futureDCall.wind.speed} mph</span></p>
                  </div>
          `;
      }
      
      futureHTML += `</div>`;
      $('#future-weather').html(futureHTML);
  })

}

// saves city name into local storage and appends to list
const saveSearchedCity = (searchedCity) => {
    const searchedCitiesLs = JSON.parse(localStorage.getItem('cities')) || [];
    if(searchedCitiesLs.findIndex(el => el == searchedCity) != -1) return;
    searchedCitiesLs.push(searchedCity);
    localStorage.setItem('cities', JSON.stringify(searchedCitiesLs));
    renderSearchedCities();
}
// lists searched cities as  buttons
const renderSearchedCities = () => {
    const searchedCitiesLs = JSON.parse(localStorage.getItem('cities')) || [];
    cityList.innerHTML = '';
    for (let i = 0; i < searchedCitiesLs.length; i++) {
        const li = document.createElement('li');
        li.className = 'btn btn-secondary w-100 mt-2';
        li.setAttribute('id', `list-cities${i}`);
        li.setAttribute('type', 'button');
        li.textContent = searchedCitiesLs[i];
        console.log(li.textContent)
        cityList.prepend(li);
    }
}

// adds click listener to search button
$('#search-city').on('click', (event) => {
    // event.preventDefault();
    currentCity = $('#input').val();
    getCurrentWeather(event);
});

// adds click listener to searched city buttons
$('#list-cities').on("click", (event) => {
    // event.preventDefault();
    $(`input`).val(event.target.textContent);
    currentCity = $('input').val();
    console.log(currentCity);
    getCurrentWeather(event);
});

renderSearchedCities();