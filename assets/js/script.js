// var searchEl = document.querySelector("#search");
const apiKey = "78226ef2dd12503663f82f2dfa7771bc";

var searchEl = document.querySelector("#citySearch");
var weatherContainerEl = document.querySelector("#currentWeatherContainer");
var searchedCityEl = document.querySelector("#currentCity");

var searchHandler = function(event){
    event.preventDefault();
    var city = searchEl.value.trim();
    console.log(city);
    console.log("clicked search button")


    getWeather(city);
};

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

// gets current weather from openweathermap
var getWeather = function(city){
    var apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + apiKey;
    
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city)
        });
    });
};

// displays current weather
var displayWeather = function(weather){
    console.log(weather);

    // clear old content
    weatherContainerEl.textContent = "";
    searchEl.textContent = "";

    // create data element
    var currentDate = document.createElement("span");
    currentDate.textContent=" (" + moment(weather.value).format("MMM D, YYYY") + ") ";
    searchedCityEl.appendChild(currentDate);

    // create image element
    var weatherIcon = document.createElement("img");
    // weatherIcon.setAttribute("src", 'https://openweathermap.org/img/wn/${weather[0].icon}@2x.png');
    searchedCityEl.appendChild(weatherIcon);

    // create span to hold temp data
    var tempData = document.createElement("span");
    tempData.textContent = "Temperature: " + weather.main.temp + "°F";
    tempData.classList = "list-group-item";

    //create a span to hold Humidity data
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"

    //create a span to hold Wind data
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"

    weatherContainerEl.appendChild(tempData);
    weatherContainerEl.appendChild(humidityEl);
    weatherContainerEl.appendChild(windSpeedEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;

    getUv(lat, lon);
};

// use lat and lon variables to get uv index

var getUv = function(lat, lon){
    var apiURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + apiKey
    + '&lat=' + lat + '&lon=' + lon;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUv(data);
            console.log(data);
        });
    });
}

var displayUv = function(index){

    var displayUvEl = document.createElement("div");
    displayUvEl.textContent = "UV Index: ";
    displayUvEl.classList = "list-group-item";

    uvIndex = document.createElement("span");
    uvIndex.textContent = index.value;

    if(index.value <=2){
        uvIndex.classList = "favorable"
    }
    else if (index.value >2 && index.value <=8){
        uvIndex.classList = "moderate"
    }
    else if (index.value > 8){
        uvIndex.classList = "severe"
    }

    displayUvEl.appendChild(uvIndex);
    weatherContainerEl.appendChild(displayUvEl);
}
// click handlers
$("#searchBtn").on("click", searchHandler);