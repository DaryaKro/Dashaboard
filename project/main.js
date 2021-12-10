// выпадающий список с автозаполнением
var dataList = document.getElementById('data');
var input = document.getElementById('ajax');

var request = new XMLHttpRequest();
var data = 'data.json';
var jsonOptions = [];

request.open('GET', data, true);
request.send();

request.onreadystatechange = function(response) {
    if (request.readyState === 4 && request.status === 200) {
        jsonOptions = JSON.parse(request.responseText);

        jsonOptions.forEach(function(item) {
            var option = document.createElement('option');
            option.value = item.city;
            dataList.appendChild(option);
        });

        input.placeholder = "Название города...";
    } else {
        input.placeholder = "Ошибка загрузки data";
    }
};

// вывод погоды в выбранном городе
var button = document.querySelector(".submit");
var input = document.querySelector(".inputcity");
var key = "6e2b599a4fa06e47ba5cf31e33132d55";
var massOfTemp = [];
var massOfCity = [];
var viewModelOfList = [];

button.addEventListener('click', function(name) {
    if(!input.value) {
        alert("Введите название города");
        return;
    }

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + input.value + "&units=metric&appid=" + key)
        .then(response => response.json())
            .then(data => {
    
            var nameValue = input.value;
            var tempValue = Math.round(data["main"]["temp"]);
            var windValue = Math.round(data["wind"]["speed"]);
            var pressureValue = Math.round(0.75 * data["main"]["pressure"]);
            var weatherValue = data["weather"]["0"]["main"];

            var item = jsonOptions.find((element, index, array) => {return element.city === input.value}, this);

            if (!item) {
                alert("Нет информации по заданному городу");
                return;
            }

            var cardValue = {
                nameValue: nameValue,
                tempValue: tempValue,
                windValue: windValue,
                pressureValue: pressureValue,
                weatherValue: weatherValue,
                visible: true,
            }

            viewModelOfList.push(cardValue);
            addCard(cardValue);
            input.value = "";
    })
});

function addCard(cardValue) {
    var cardOfCity = document.createElement('div');
    cardOfCity.className = "card";

    cardOfCity.addEventListener("click", removeCard);

    function removeCard() {
        let card = this;
        card.style.opacity = 1;
        let cardId = setInterval(function() {
            if (card.style.opacity >= 0) {
                card.style.opacity -= .2;
            } else {
                clearInterval(cardId);
                let city = card.getElementsByClassName("city")[0].innerHTML;
                card.remove();
                let delIndex = viewModelOfList.findIndex((a) => {return a.nameValue === city});
                viewModelOfList.splice(delIndex, 1);
            }
        }, 60)
    }

    var nameOfCity = document.createElement('div');
    // nameOfCity.innerHTML = item.city;
    nameOfCity.innerHTML = cardValue.nameValue;
    nameOfCity.className = "city";
    cardOfCity.appendChild(nameOfCity);

    var weather = document.createElement('div');
    weather.className = "weatherAndTemp";

        var weatherImg = document.createElement('div');
        // weatherImg.innerHTML = "<img src=./img/" + item.weather + ".png>";
        weatherImg.innerHTML = "<img src=./img/" + cardValue.weatherValue + ".png>";
        weatherImg.className = "weather";      

        var tempInCity = document.createElement('div');
        // tempInCity.innerHTML = item.temp  + " °c";
        tempInCity.innerHTML = cardValue.tempValue  + " °c";
        tempInCity.className = "temp";

        weather.appendChild(weatherImg);
        weather.appendChild(tempInCity);
        
    cardOfCity.appendChild(weather);

    var wind = document.createElement('div');
    // wind.innerHTML = "Ветер: " + item.wind + " м/с";
    wind.innerHTML = "Ветер: " + cardValue.windValue + " м/с";
    wind.className = "wind";
    cardOfCity.appendChild(wind);

    var pressure = document.createElement('div');
    // pressure.innerHTML = "Давление: " + item.pressure + " мм";
    pressure.innerHTML = "Давление: " + cardValue.pressureValue + " мм";
    pressure.className = "pressure";
    cardOfCity.appendChild(pressure);

    var closer = document.createElement('span');
    closer.className = "close";
    cardOfCity.appendChild(closer);
    
    var container = document.querySelector(".container");
    container.appendChild(cardOfCity);
}

// вывод значения на скролле
function tempInRange(value) {
    document.getElementById("temp").innerHTML = value + " °c";
    viewModelOfList.forEach((a) => {
        if(a.tempValue < value && a.visible) {
            a.visible = false;
            let elements = Array.from(document.getElementById("container").children);
            let filteredElements = elements.filter((b) => {
                let city = b.getElementsByClassName("city")[0].innerHTML;
                return city === a.nameValue;
            });
            filteredElements.forEach((b) => {
                b.remove();
            });
        } 
    }, this)
    viewModelOfList.forEach((a) => {
        if(a.tempValue >= value && !a.visible) {
            a.visible = true;
            // Add element.
            addCard(a);
        } 
    }, this);
}



