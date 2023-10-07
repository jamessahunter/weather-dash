var city=$("#input-city");
var button=$(".btn");
var currentWeather=$('#current-weather');
var futureWeather=$("#future-weather");

button.on("click", function(event){
    event.preventDefault();
    console.log("works");
    console.log(city);
    var cityInput=city.val();
    console.log(cityInput);
})
