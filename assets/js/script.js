var city=$("#input-city");
var button=$(".btn");
var currentWeather=$('#current-weather');
var futureWeather=$("#future-weather");

button.on("click", function(event){
    event.preventDefault();
    // console.log("works");
    // console.log(city);
    var cityInput=city.val();
    // console.log(cityInput);
    fetchLatLon(cityInput);
    


})


function fetchLatLon(city){
    var cityUrl="http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=5b9958094719db83e44615746cf27208";
    fetch(cityUrl)
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                console.log(data);
                // console.log(data[0]);
                // console.log(data[0].lon);
                // console.log(data[0].lat);
                var lat=data[0].lat;
                var lon=data[0].lon;
                fetchWeatherCurrent(lat,lon);
                fetchWeatherFuture(lat,lon);
            })
        }
    })

}

function fetchWeatherCurrent(lat,lon){
    var currentUrl="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=5b9958094719db83e44615746cf27208&units=imperial";
    fetch(currentUrl)
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                console.log(data);
                console.log(data.wind.speed);
                console.log(data.main.temp);
                console.log(data.main.humidity);
            })
        }
    })

}

function fetchWeatherFuture(lat,lon){
    var futureUrl="https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=5b9958094719db83e44615746cf27208&units=imperial";
    fetch(futureUrl)
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                console.log(data);
                // console.log(data.wind.speed);
                // console.log(data.main.temp);
                // console.log(data.main.humidity);
            })
        }
    })
}