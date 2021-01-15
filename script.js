var searchHistory = [];
if(localStorage.getItem("weatherHistory")){
    searchHistory= JSON.parse(localStorage.getItem("weatherHistory"));
    search(searchHistory[searchHistory.length-1]);
}


function displayHistory(){
    $(".historyList").empty()
    var upperLimit = 10
    if(searchHistory.length<10){
        upperLimit = searchHistory.length;
    }
    while (searchHistory.length >10){
        searchHistory.splice(0,1)
    }
    for(i=0;i<upperLimit;i++){
        let newBtn = $("<button>").text(searchHistory[i]).attr("class", "historyBtn list-group-item")
        $(".historyList").append(newBtn)
    }
}
function init(){
    let city = $(".searchBar").val();
    if(city == ""){
        city =  $(this).text();
    }
    search(city)
    searchHistory.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistory))
    displayHistory()
}

function search(city) {
    // Current weather API
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3eb307e64f156b8aa3fd62e98c77fd77&units=imperial`,
        method: "GET"
    }).then(function (res) {
        console.log(res);

        // document.querySelector(".cityName").textContent = `${res.name} (${Date.now})`;
        $(".cityName").text(`${res.name} (${moment().format('LL')})`);
        $(".cityNameIcon").attr("src", `http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`);
        $(".temp").text(`Temperature: ${res.main.temp} degrees F`);
        $(".humidity").text(`Humidity: ${res.main.humidity} %`);
        $(".windSpeed").text(`Wind Speed: ${res.wind.speed} MPH`);
        // $(".uvIndex").text(`UV Index: ${res.main.}`)
        $.ajax({
            url: `http://api.openweathermap.org/data/2.5/uvi?lat=${res.coord.lat}&lon=${res.coord.lon}&appid=3eb307e64f156b8aa3fd62e98c77fd77`,
            method: 'GET'
        }).then(function (responseTwo) {
            // console.log(responseTwo)
            $(".uvIndex").text(`UV Index: ${responseTwo.value}`)
            if(responseTwo.value <3){
                $(".uvIndex").attr("class", "bg-success rounded")
            } else if(responseTwo.value >=3 && responseTwo.value<5){
                $(".uvIndex").attr("class", "bg-warning rounded")
            } else if(responseTwo.value>5){
                $(".uvIndex").attr("class", "bg-danger rounded")
            }
        })
    })

    // 5 Day forcast API
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=3eb307e64f156b8aa3fd62e98c77fd77&units=imperial`,
        method: "GET"
    }).then(function (res) {
        console.log(res);

        for(var i = 3; i < res.list.length; i+=8){
            var forcast = res.list[i];
            var day = (i-3)/8;
            $(`.day-${day}-date`).text(`${forcast.dt_txt.split(" ")[0]}`);
            $(`.day-${day}-icon`).attr("src", `http://openweathermap.org/img/wn/${forcast.weather[0].icon}@2x.png`);
            $(`.day-${day}-temp`).text(`Temp: ${forcast.main.temp} degrees F`);
            $(`.day-${day}-humidity`).text(`Humidity: ${forcast.main.humidity} %`);
        }

    })
    $(".searchBar").val("")
}

$(".searchButton").on("click", init)
$(document).on("click", ".historyBtn", init)
displayHistory()
// 3eb307e64f156b8aa3fd62e98c77fd77

