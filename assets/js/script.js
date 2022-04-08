// var searchEl = document.querySelector("#search");

var cities = [];
const apiKey = "78226ef2dd12503663f82f2dfa7771bc";

var searchEl = document.querySelector("#citySearch");
var weatherContainerEl = document.querySelector("#currentWeatherContainer");
var searchedCityEl = document.querySelector("#currentCity");
var forecastContainerEl = document.querySelector("#forecastFiveDay");


var searchHandler = function(event){
    event.preventDefault();
    var city = searchEl.value.trim();

    if(city){
        getWeather(city);
        getForecast(city);

        cities.unshift({city});
        searchEl.value = "";
    }
    else {
        alert("Please enter a City");
    }

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
var displayWeather = function(weather, searchCity){
    // console.log(weather);

    // clear old content
    weatherContainerEl.textContent = "";
    searchedCityEl.textContent = "";

    // create data element
    var currentDate = document.createElement("span");
    currentDate.textContent= searchCity + " (" + moment(weather.value).format("MMM D, YYYY") + ") ";
    searchedCityEl.appendChild(currentDate);

    // create image element
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
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
            // console.log(data);
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

// pulls 5 day forecast 

var getForecast = function(city){
    var apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=' + apiKey;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayForecast(data)
            console.log(data)
        });
    });
};

// displays 5 day forecast
var displayForecast = function(weather){
    forecastContainerEl.textContent = "";

    var forecast = weather.list;
    
    for(var i=5; i <forecast.length; i= i+8){
        var dailyForecast = forecast[i];

        // create div for each day
        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-primary text-light m-2";

        var forecastDate = document.createElement("h4");
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center";
        forecastEl.appendChild(forecastDate);

        // console.log(dailyForecast);
        
        var weatherIcon = document.createElement("img");
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);
        forecastEl.appendChild(weatherIcon);

        var forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = dailyForecast.main.temp + " °F";
        forecastEl.appendChild(forecastTempEl);
        
        var forecastHumidEl = document.createElement("span");
        forecastHumidEl.classList = "card-body text-center";
        forecastHumidEl.textContent = dailyForecast.main.humidity + " %";        
        
        forecastEl.appendChild(forecastHumidEl);

        forecastContainerEl.appendChild(forecastEl);
    }
    
}

// click handlers
$("#searchBtn").on("click", searchHandler);