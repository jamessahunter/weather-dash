//reates variable for the elements on the webpage
var cityInput=$("#input-city");
var button=$(".btn");
var currentWeather=$('#current-weather');
var futureWeather=$("#future-weather");
var citiesCont=$("#cities-container");
var today;
var cities=[];
// call for initial function
init();

// initial function
function init(){
    // retrieves and cities already stored locally
    var storedCities=JSON.parse(localStorage.getItem("cities"));

    //checks to see if the object is poplated
      if (storedCities!==null){
        //put the array into the events variable
        cities=storedCities;

      }
    // calls display cities
      displayCities();
}

// function to display the cities
function displayCities(){
    // clears out any text that may have been there
    citiesCont.text("");
    // for loop for the length of the stored cities
    for (let i = 0; i < cities.length; i++) {
        // creates new element with the city name
        var city=$("<h4>").text(cities[i]);
        // appends new element to the page
        citiesCont.append(city);
    }
}
// function to store the cities
function storeCities(){
    // puts the items into a string
    localStorage.setItem("cities",JSON.stringify(cities));
}

// event listener on the search button 
button.on("click", function(event){
    // prevetns the form from resesting
    event.preventDefault();
    //checks to see if something has been entered
    if(cityInput.val() === ""){
        return;
    }
    // calls fetch lat lon function
    fetchLatLon(cityInput.val());
})

//event listener on the displayed cities
citiesCont.on("click","h4",function(event){
    //gets the city that was clicked on
    var cityClicked=event.target.textContent;
    //calls fetch lat and lon
    fetchLatLon(cityClicked);

})

// function to ge the latitude and longitude of a city
function fetchLatLon(city){
    // checks if the user also enter the state
    if(city.includes(",")){
        var cityUrl="http://api.openweathermap.org/geo/1.0/direct?q=" + city.split(",")[0].trim()+ "," +city.split(",")[1].trim()+ ",USA&limit=1&appid=5b9958094719db83e44615746cf27208"
    }
    //user just entered the city
    else{
        var cityUrl="http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=5b9958094719db83e44615746cf27208";
    }
    // console.log(cityUrl);
    fetch(cityUrl)
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                // console.log(data);
                //checks that a city insidethe us was entered
                if(data===null){
                    // retrieves that lat and lon data
                    var lat=data[0].lat;
                    var lon=data[0].lon;
                    //calls the fetch weather functions
                    fetchWeatherCurrent(lat,lon);
                    fetchWeatherFuture(lat,lon);
                    // adds the city to the cities list
                    cities.push(cityInput.val());
                    //calls stores cities function
                    storeCities();
                    // calls display cities function
                    displayCities();

                }
                else{
                    // console.log("failed");
                    return;
                }
            })
        }

    })

}

// fetches the cirrent weather
function fetchWeatherCurrent(lat,lon){
    var currentUrl="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=5b9958094719db83e44615746cf27208&units=imperial";
    fetch(currentUrl)
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                // calls the display current function
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
                // calls the display future function
                displayFuture(data.list);
            })
        }
    })
}

// displays the current weather
function displayCurrent(data){
    // console.log(data);
    // clears any text in the section
    currentWeather.text("");
    // gets todays date
    today=dayjs().format('M/D');
    //call the get icon function
    var icon=getIcon(data);
    // creates new elements for city name, date, icon,temp, wind ,humidity
    var cityCurr=$("<h2>").text(data.name);
    var dateCurr=$("<h3>").text(today);
    var iconCurr=$("<p>").text(icon);
    var tempCurr=$("<p>").text("Temp: "+data.main.temp+ " °F");
    var windCurr=$("<p>").text("Wind: "+data.wind.speed+" MPH");
    var humCurr=$("<p>").text("Humidity: "+ data.main.humidity+"%");
    // appends new elements to the page
    currentWeather.append(cityCurr,dateCurr,iconCurr,tempCurr,windCurr,humCurr).addClass("card");
}

// displays the futre weathe
function displayFuture(data){
    // console.log(data.list);
    // clears any text already displayed
    futureWeather.text("");
    // gets the weather at noon
    for(var i=5;i<40;i+=8){
        // console.log(data[i]);
        // converts the date to match the formating
        var date=dayjs(data[i].dt_txt).format("M/D");
        // console.log(date);
        var icon=getIcon(data[i]);
        // creates card for each day
        var sectionCard=$("<section>").addClass("card");
        // creates new elements for city name, date, icon,temp, wind ,humidity
        var dateFut=$("<h2>").text(date);
        var iconFut=$("<p>").text(icon);
        var tempFut=$("<p>").text("Temp: " + data[i].main.temp+ " °F");
        var windFut=$("<p>").text("Wind: " + data[i].wind.speed+" MPH");
        var humFut=$("<p>").text("Humidity: " + data[i].main.humidity+"%");
        // appends info the the card
        sectionCard.append(dateFut,iconFut,tempFut,windFut,humFut).addClass("col");
        //appends info to the page
        futureWeather.append(sectionCard);
    }
}

// gets the icon for the weather
function getIcon(data){
    var icon;
    // uses switch to get the icon
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