var cityInput=$("#input-city");
var button=$(".btn");
var currentWeather=$('#current-weather');
var futureWeather=$("#future-weather");
var citiesCont=$("#cities-container");
var today;
var cities=[];

init();

function init(){
    var storedCities=JSON.parse(localStorage.getItem("cities"));

    //checks to see if the object is poplated
      if (storedCities!==null){
        //put the array into the events variable
        cities=storedCities;

      }
      displayCities();
}

function displayCities(){
    citiesCont.text("");
    for (let i = 0; i < cities.length; i++) {
        var city=$("<h3>").text(cities[i]);
        console.log(city);
        citiesCont.append(city);
    }
}

function storeCities(){
    localStorage.setItem("cities",JSON.stringify(cities));
}

button.on("click", function(event){
    event.preventDefault();
    if(cityInput.val() === ""){
        return;
    }
    cities.push(cityInput.val());
    storeCities();
    displayCities();
    fetchLatLon(cityInput.val());
})

citiesCont.on("click","h3",function(event){
    var cityClicked=event.target.textContent;
    fetchLatLon(cityClicked);

})


function fetchLatLon(city){
    var cityUrl="http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=5b9958094719db83e44615746cf27208";
    fetch(cityUrl)
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
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
                displayFuture(data.list);
            })
        }
    })
}

function displayCurrent(data){
    today=dayjs().format('M/D');
    var icon=getIcon(data);
    var dateCurr=$("<h2>").text(today);
    var iconCurr=$("<p>").text(icon);
    var tempCurr=$("<p>").text("Temp: "+data.main.temp);
    var windCurr=$("<p>").text("Wind: "+data.wind.speed);
    var humCurr=$("<p>").text("Humidity: "+ data.main.humidity);
    currentWeather.append(dateCurr,iconCurr,tempCurr,windCurr,humCurr);
}

function displayFuture(data){
    // console.log(data.list);
    for(var i=5;i<40;i+=8){
        // console.log(data[i].dt_txt);
        var date=dayjs(data[i].dt_txt).format("M/D");
        // console.log(date);
        var icon=getIcon(data[i]);
        var sectionCard=$("<section>").addClass("card");
        var dateFut=$("<h2>").text(date);
        var iconFut=$("<p>").text(icon);
        var tempFut=$("<p>").text("Temp: " + data[i].main.temp);
        var windFut=$("<p>").text("Wind: " + data[i].wind.speed);
        var humFut=$("<p>").text("Humidity: " + data[i].main.humidity);
        sectionCard.append(dateFut,iconFut,tempFut,windFut,humFut);
        futureWeather.append(sectionCard);
    }



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