let data = {};

let sector = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];

let cityWeatherData;
let showMetric = false;

function getCamelCaseName(cityName) {
    return cityName.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

function buildPullDownMenuAndArm(cityName) {
    let pullDownMenu = document.getElementById("pullDownMenu");
    let newButton = document.createElement("button");
    let idName = getCamelCaseName(cityName) + "Btn";
    let className = "pickCity";
    newButton.id=idName;
    newButton.className=className;
    newButton.innerHTML=cityName;
    pullDownMenu.appendChild(newButton);
    newButton.addEventListener("click", function() {
        let btnCityName = newButton.innerHTML;
        let cityWeatherData=parseData4City(btnCityName, data);
        displayCityData(cityWeatherData);
    });
}

function convert2DateString(timeStamp) {
  let date = new Date(timeStamp*1000);
  let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};
  return date.toLocaleString("en-US");
}

function convert2SI(conversion, value) {
  switch (conversion) {
    case "f2C": return Math.round(((value-32)*5/9)*100)/100;
    case "mPH2MPS" : return Math.round((value*0.44704)*100)/100;
    case "inches2MM" : return Math.round((value*25.4)*100)/100;
    default: return value;
  }
}

function convertDegs2WD(degs) {
    return sector[Math.round((degs%360)/22.5)];
}

function parseData4City(cityName, data) {
    return data.list.find((e)=>{return e.name === cityName});
}

function parseDataAllCities(data) {
    for (cityReadings of data.list) {
        displayCityData(cityReadings);
    }
}

function updateBackgroundClassName(cityName) {
    let className;
    let classNameDiv;

    className = getCamelCaseName(cityName);
    classNameDiv = document.getElementById("backgroundId");
    classNameDiv.className = className;

}

function updateCityDiv(cityName) {
    let cityIdName;
    let cityDiv;

    //ADD CITY NAME
    cityIdName = "cityName";
    cityDiv = document.getElementById(cityIdName);
    cityDiv.innerHTML = cityName;   

}

function constructWeatherIcon(weatherInfoArr) {
    let iconId;
    let cityIcon;
    let daynight;

    //CONSTRUCT WEATHER ICON
    iconId = "cityIconTemperature";
    cityIcon = document.getElementById(iconId);
    if (weatherInfoArr.icon.slice(-1) === 'd') {
        daynight = 'day';
    } else {
        daynight = 'night';
    }
    cityIcon.className = "wi wi-owm-" + daynight + "-" + weatherInfoArr.id;
    cityIcon.innerHTML=weatherInfoArr.main;
}

function updateTemperatureDiv(temp) {
    let cityTemperature;
    let cityTemp;

    //ADD TEMPERATURE TO CITY TABLE
    cityTemperature = "cityTemperature"
    cityTemp = document.getElementById(cityTemperature);
    if (!showMetric) {
        cityTemp.innerHTML = temp + " ℉";
    } else {
        cityTemp.innerHTML = convert2SI("f2C", temp) + " °C";
    }
}

function updateHumidityDiv(hum) {
    let humidity;
    let cityHumidity;

    //ADD HUMIDITY TO CITY TABLE
    humidity = "cityHumidity";
    cityHumidity = document.getElementById(humidity);
    cityHumidity.innerHTML = "Humidity: " + hum + "%";
}

function updatePressureDiv(airPres) {
    let pressure;
    let cityPressure;

    //ADD PRESSURE TO CITY TABLE
    pressure = "cityPressure";
    cityPressure = document.getElementById(pressure);
    if (!showMetric) {
        cityPressure.innerHTML = "Pressure: " + airPres + " mbar";
    } else {
        cityPressure.innerHTML = "Pressure: " + airPres + " hPa";
    }
}

function updateMinMaxTempDiv(temp, type) {
    let minMaxTemp;
    let cityMinMaxTemp;

    //ADD TEMP MIN OR MAX TO CITY TABLE
    if (type === "Min") {
        minMaxTemp = "cityTempMin";
    } else {
        minMaxTemp = "cityTempMax"
    }
    cityMinMaxTemp = document.getElementById(minMaxTemp);
    if (!showMetric) {
        cityMinMaxTemp.innerHTML = type + ": " + temp + " ℉";
    } else {
        cityMinMaxTemp.innerHTML = type + ": " + convert2SI("f2C", temp) + " °C";
    }
}

function updateWindDiv(ws) {
    let windSpeed;
    let cityWindSpeed;

    //ADD WIND SPEED TO CITY TABLE
    windSpeed = "cityWindSpeed";
    cityWindSpeed = document.getElementById(windSpeed);
    if (!showMetric) {
        cityWindSpeed.innerHTML = "Wind Speed: " + ws + " mph";
    } else {
        cityWindSpeed.innerHTML = "Wind Speed: " + convert2SI("mPH2MPS", ws) + " m/s";
    }
}

function updateWindDirDiv(deg) {
    let windDirection;
    let cityWindDirection;
    let iconDirection;
    let cityIconWind;
    
    //ADD WIND DIRECTION TO CITY TABLE
    windDirection = "cityWindDirection";
    cityWindDirection = document.getElementById(windDirection);
    iconDirection = "cityIconSpeed";
    cityIconWind = document.getElementById(iconDirection);
    //round to nearest integer
    if (deg !== undefined) {
        cityIconWind.className = "wi wi-wind towards-" + Math.round(deg) + "-deg";
        cityWindDirection.innerHTML = "Wind Direction: " + convertDegs2WD(deg);
    } else {
        cityIconWind.className = "";
        cityWindDirection.innerHTML = "No Direction Data";
    }
}

function updateRainSnowDiv(amt, type) {
    let level;
    let cityLevel;

    //ADD RAIN OR SNOW TO CITY TABLE
    if (type === 'Rain') {
        level = "cityRain";
    } else {
        level = "citySnow";
    }
    cityLevel = document.getElementById(level);
    if (amt === null) {
        if (!showMetric) {
            cityLevel.innerHTML = type + ": " + "0.0" + " inches";
        } else {
            cityLevel.innerHTML = type + ": " + "0.0" + " mm";
        }
    } else {
        if (!showMetric) {
            cityRainLevel.innerHTML = type + ": " + amt + " inches";
        } else {
            cityRainLevel.innerHTML = type + ": " + convert2SI("inches2MM", amt) + " mm";
        }
    }
}

function updateDateDiv(dt) {
    let timeStamp;
    let cityTimeStamp;

    timeStamp = "timeStamp";
    cityTimeStamp = document.getElementById(timeStamp);
    cityTimeStamp.innerHTML = convert2DateString(dt);
}

function displayCityData(cityData) {
    //GET BACKGROUND CLASS NAME
    updateBackgroundClassName(cityData.name);

    //ADD CITY NAME
    updateCityDiv(cityData.name);

    //CONSTRUCT WEATHER ICON
    constructWeatherIcon(cityData.weather[0]);

    //ADD TEMPERATURE TO CITY TABLE
    updateTemperatureDiv(cityData.main.temp);

    //ADD HUMIDITY TO CITY TABLE
    updateHumidityDiv(cityData.main.humidity);

    //ADD PRESSURE TO CITY TABLE
    updatePressureDiv(cityData.main.pressure);

    //ADD MIN TEMPERATURE TO CITY TABLE
    updateMinMaxTempDiv(cityData.main.temp_min, "Min");

    //ADD MAX TEMPERATURE TO CITY TABLE
    updateMinMaxTempDiv(cityData.main.temp_max, "Max");

    //ADD WIND SPEED TO CITY TABLE
    updateWindDiv(cityData.wind.speed);

    //ADD WIND DIRECTION TO CITY TABLE
    updateWindDirDiv(cityData.wind.deg);

    //ADD RAIN TO CITY TABLE
    updateRainSnowDiv(cityData.rain, "Rain");

    //ADD SNOW TO CITY TABLE
    updateRainSnowDiv(cityData.snow, "Snow");

    //ADD DATE TO CITY TABLE
    updateDateDiv(cityData.dt);

    //UPDATE FOOTER
    lastUpdated = document.getElementById("LastUpdated");
    let d = new Date();
    let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};
    lastUpdated.innerHTML = "Last updated on: " + d.toLocaleString("en-US");
}

let xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText);
        //console.log(data);
        //Sort data by city name
        data.list.sort((a,b)=>{
            let cityNameA = a.name.toUpperCase();
            let cityNameB = b.name.toUpperCase();
            return (cityNameA < cityNameB) ? -1 : (cityNameA > cityNameB) ? 1 : 0;
        });
        //Build Menu and Arm buttons
        for (cityWeatherData of data.list) {
            buildPullDownMenuAndArm(cityWeatherData.name);
        }
    }
};
xmlhttp.open("GET", "https://api.openweathermap.org/data/2.5/find?lat=35.2827&lon=-120.6597&cnt=30&units=imperial&APPID=8218f32a5a56656951925fb0010aba72", true);
xmlhttp.send();

//Build and Arm F/C button.
let myBtn = document.getElementById("fToCButton");
myBtn.addEventListener("click", function() {
    let letter = myBtn.innerHTML;
    let cityNameId = document.getElementById("cityName");
    let cityName = cityNameId.innerHTML;
    if (letter === "F") {
        myBtn.innerHTML = "C";
        showMetric = true;
    } else {
        myBtn.innerHTML = "F";
        showMetric = false;
    }
    //If we haven't selected a city yet. Don't show data.
    if (cityName !== '--') {
        let cityWeatherData=parseData4City(cityName, data);
        displayCityData(cityWeatherData);
    }
});
