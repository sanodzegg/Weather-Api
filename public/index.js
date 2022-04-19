"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// const API_KEY = "3904a619c0f5dcf46f467b1944ab6d1d";
const API_KEY = config.API_KEY;
const getInfoBtn = document.getElementById("searchBtn");
const inputValue = document.getElementById("search");
// current date
const date = new Date();
const month = date.toLocaleString('default', { month: 'long' });
const day = date.getUTCDate();
const fullDate = `${day} ${month}`;
// 
let userLocation;
const weatherIcon = document.getElementById("weatherIcon");
const userCountry = document.getElementById("userCountry");
const currentDate = document.getElementById("currentDate");
const userTemperature = document.getElementById("userTemperature");
const floatDegree = document.getElementById("floatDegree");
const userWeatherDescription = document.getElementById("userWeatherDescription");
// weather info
const dewPoint = document.getElementById("dewPoint");
const dpText = document.getElementById("dpText"); // dewPoint Description text
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const pressure = document.getElementById("pressure");
const sunriseTime = document.getElementById("sunriseTime");
const sunsetTime = document.getElementById("sunsetTime");
const resultsTab = document.getElementById("resultsTab");
const searchResultIcon = document.getElementById("searchResultIcon");
const searchResultName = document.getElementById("searchResultName");
const searchResultDescription = document.getElementById("searchResultDescription");
const searchResultTemperature = document.getElementById("searchResultTemperature");
const loaderIcon = document.getElementById("loaderIcon");
const themeSwitcher = document.getElementById("themeSwitcher");
const themeSwitcherBtn = themeSwitcher.childNodes[1];
const domArr = [userCountry, currentDate, userTemperature, floatDegree, userWeatherDescription, dewPoint, feelsLike, windSpeed, pressure, sunriseTime, sunsetTime];
class Display {
    constructor(iconpath, userCountry, currentDate, userTemperature, floatDegree, userWeatherDesc, dewPoint, feelsLike, windSpeed, pressure, sunrise, sunset) {
        this.iconpath = iconpath;
        this.userCountry = userCountry;
        this.currentDate = currentDate;
        this.userTemperature = userTemperature;
        this.floatDegree = floatDegree;
        this.userWeatherDesc = userWeatherDesc;
        this.dewPoint = dewPoint;
        this.feelsLike = feelsLike;
        this.windSpeed = windSpeed;
        this.pressure = pressure;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.dataArr = [this.userCountry, this.currentDate, this.userTemperature, this.floatDegree, this.userWeatherDesc, this.dewPoint, this.feelsLike, this.windSpeed, this.pressure, this.sunrise, this.sunset];
        this.fill = () => {
            domArr.forEach((e, i) => {
                e.innerHTML = this.dataArr[i];
            });
            weatherIcon.setAttribute("src", this.iconpath);
        };
    }
    ;
}
// const getInfo = (url:string) => {
//     fetch(url).then(res => res.json()).then(data => {console.log(data);
//     });
// }
let localTheme;
document.addEventListener("DOMContentLoaded", () => {
    findUserLocation("current");
    let theme = localStorage.getItem("theme");
    if (theme == "light") {
        localTheme = true;
        themeChanger("light");
    }
    else {
        localTheme = false;
        themeSwitcherBtn.classList.add("active");
        themeChanger("dark");
    }
});
inputValue === null || inputValue === void 0 ? void 0 : inputValue.addEventListener("keyup", () => {
    let val = inputValue.value;
    if (val.length > 0) {
        resultsTab.style.animation = "show .5s ease-in-out forwards";
        fetchSearched(val).then(e => {
            searchResultIcon.setAttribute("src", `http://openweathermap.org/img/wn/${e.icon}@2x.png`);
            searchResultName.innerText = e.name;
            searchResultDescription.innerText = e.description;
            searchResultTemperature.innerText = e.temperature;
            loaderIcon.style.display = "none";
        });
    }
    else {
        resultsTab.style.animation = "hide .5s ease-in-out forwards";
        searchResultIcon.removeAttribute("src");
        searchResultName.innerText = "";
        searchResultDescription.innerText = "";
        searchResultTemperature.innerText = "";
        loaderIcon.style.display = "";
    }
});
// resultsTab.addEventListener("click", () => {
//     const searchedData = new Display (
//     );
// });
// getInfoBtn?.addEventListener("click", () => {
//     let val = (inputValue as HTMLInputElement).value;
//     if(val.length != 0) {
//         fetchSearched(val);
//     }
// });
const userWeather = () => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${randomNumber(-180, 180)}&lon=${randomNumber(-180, 180)}&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data);
    });
};
const findUserLocation = (type) => __awaiter(void 0, void 0, void 0, function* () {
    let lat, lon, city;
    if (type === "current") {
        const success = (position) => __awaiter(void 0, void 0, void 0, function* () {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            let resp = yield fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            let data = yield resp.json();
            generateForecast(data, "current");
            userLocation = data.timezone.split("/")[1];
            let parsed = data.current.temp.toString().split(".");
            let sunriseH = new Date(data.current.sunrise).getHours();
            let sunriseM = new Date(data.current.sunrise).getMinutes();
            let sunrise = `${sunriseH}:${sunriseM} AM`;
            let sunsetH = new Date(data.current.sunset).getHours();
            let sunsetM = new Date(data.current.sunset).getMinutes();
            let sunset = `${sunsetH}:${sunsetM} PM`;
            const newData = new Display(`http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`, data.timezone, fullDate, parsed[0], `.${parsed[1]}°`, data.current.weather[0].description, data.current.dew_point, data.current.feels_like, `${data.current.wind_speed}m/s`, data.current.pressure, sunrise, sunset);
            newData.fill();
        });
        const error = () => {
            console.log("unable");
        };
        navigator.geolocation.getCurrentPosition(success, error);
    }
    else if (type === "search") {
        city = inputValue.value;
        let resp = yield fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data = yield resp.json();
        generateForecast(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`, "search");
        let parsed = data.main.temp.toString().split(".");
        let sunriseH = new Date(data.sys.sunrise).getHours();
        let sunriseM = new Date(data.sys.sunrise).getMinutes();
        let sunrise = `${sunriseH}:${sunriseM} AM`;
        let sunsetH = new Date(data.sys.sunset).getHours();
        let sunsetM = new Date(data.sys.sunset).getMinutes();
        let sunset = `${sunsetH}:${sunsetM} PM`;
        dpText.innerText = "Humidity";
        const newData = new Display(`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`, data.name, fullDate, parsed[0], `.${parsed[1]}°`, data.weather[0].description, data.main.humidity, data.main.feels_like, `${data.wind.speed}m/s`, data.main.pressure, sunrise, sunset);
        newData.fill();
        resultsTab.style.animation = "hide .5s ease-in-out forwards";
    }
});
resultsTab.addEventListener("click", () => {
    findUserLocation("search");
});
const fetchSearched = (term) => __awaiter(void 0, void 0, void 0, function* () {
    let resp = yield fetch(`https://api.openweathermap.org/data/2.5/weather?q=${term}&appid=${API_KEY}&units=metric`);
    let data = yield resp.json();
    let displayObj = {
        name: data.name,
        icon: data.weather[0].icon,
        description: data.weather[0].description,
        temperature: `${data.main.temp}`
    };
    return displayObj;
});
const weekWeatherSection = document.getElementById("weekWeatherSection");
const generateForecast = (data, type) => __awaiter(void 0, void 0, void 0, function* () {
    let dataArr;
    if (type == "current") {
        dataArr = Object.values(data.daily);
        dataArr.forEach(e => {
            let date = new Date(e.dt * 1000);
            let month = date.toLocaleString('default', { month: 'long' });
            let day = date.getUTCDate();
            let fullDate = `${day} ${month}`;
            weekWeatherSection.innerHTML +=
                `
            <div class="week__wrapper ${localTheme == false ? "nm" : ""}">
                <h1 class="week__time">
                    ${fullDate}
                </h1>
                <img class="week__icon" src="http://openweathermap.org/img/wn/${e.weather[0].icon}.png">
                <h1 class="week__temperature">
                    ${Math.floor(e.temp.min)}°
                </h1>
            </div>
            `;
        });
    }
    else {
        let res = yield fetch(data);
        let newData = res.json();
        let lat, lon;
        newData.then(data => {
            lat = data.coord.lat;
            lon = data.coord.lon;
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
                .then(res => res.json())
                .then(data => {
                dataArr = Object.values(data.daily);
                weekWeatherSection.innerHTML = "";
                dataArr.forEach(e => {
                    let date = new Date(e.dt * 1000);
                    let month = date.toLocaleString('default', { month: 'long' });
                    let day = date.getUTCDate();
                    let fullDate = `${day} ${month}`;
                    console.log(true);
                    weekWeatherSection.innerHTML +=
                        `
                    <div class="week__wrapper ${localTheme == false ? "nm" : ""}">
                        <h1 class="week__time">
                            ${fullDate}
                        </h1>
                        <img class="week__icon" src="http://openweathermap.org/img/wn/${e.weather[0].icon}.png">
                        <h1 class="week__temperature">
                            ${Math.floor(e.temp.min)}°
                        </h1>
                    </div>
                    `;
                });
            });
        });
    }
}); // generates week weather
const themeChanger = (type) => {
    let dailyCards = document.querySelectorAll(".week__wrapper");
    let displayMessage = (text) => {
        let node = document.createElement("div");
        let message = document.createElement("p");
        document.body.append(node);
        node.setAttribute("id", "popup");
        node.append(message);
        message.innerText = text;
        node.style.animation = "showPopup .5s linear forwards";
        setTimeout(() => {
            node.style.animation = "hidePopup 1s forwards";
        }, 2500);
    };
    if (type == "light") {
        document.body.style.backgroundColor = "";
        inputValue.style.border = "";
        getInfoBtn.style.fill = "";
        resultsTab.classList.remove("nm");
        themeSwitcherBtn.style.backgroundColor = "";
        dailyCards.forEach(e => {
            e.classList.remove("nm");
        });
        displayMessage("Changed the theme to blue 🌊");
    }
    else {
        document.body.style.backgroundColor = "#282828";
        inputValue.style.border = "2px #434343 solid";
        getInfoBtn.style.fill = "#434343";
        resultsTab.classList.add("nm");
        themeSwitcherBtn.style.backgroundColor = "#1F1F1F";
        dailyCards.forEach(e => {
            e.classList.add("nm");
        });
        displayMessage("Changed the theme to dark 🌚");
    }
};
let theme;
themeSwitcher.addEventListener("click", () => {
    themeSwitcherBtn.classList.toggle("active");
    themeChanger("light");
    theme = true;
    localStorage.setItem("theme", "light");
    if (themeSwitcherBtn.classList.contains("active")) {
        themeChanger("dark");
        theme = false;
        localStorage.setItem("theme", "dark");
    }
});
const randomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
};
console.log(localStorage);
