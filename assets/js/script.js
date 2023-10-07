var city=$("#input-city");
var button=$(".btn");
var currentWeather=$('#current-weather');
var futureWeather=$("#future-weather");
var today;

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
                // console.log(data);
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
                displayCurrent(data);
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

function displayCurrent(data){
    today=dayjs().format('M/D');
    var icon=getIcon(data);
    var dateCurr=$("<h2>").text(today);
    var iconCurr=$("<p>").text(icon);
    var tempCurr=$("<p>").text(data.main.temp);
    var windCurr=$("<p>").text(data.wind.speed);
    var humCurr=$("<p>").text(data.main.humidity);
    currentWeather.append(dateCurr,iconCurr,tempCurr,windCurr,humCurr);


}

function getIcon(data){
    var icon;
    switch(data.weather[0].main){
        case "Clear":
            icon="☀"
            break;
        case "Clouds":
            icon="☁"
            break;
        case "Drizzle":
            icon="🌦"
            break;
        case "Rain":
            icon="🌧"
            break;    
        case "Thunderstorm":
           icon="⛈"
            break;
        case "Snow":
            icon="🌨"
            break;    
        default:
            icon="🌫"
    }
    return icon;

}