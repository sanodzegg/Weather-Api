const API_KEY = "3904a619c0f5dcf46f467b1944ab6d1d";
const getInfoBtn = document.getElementById("searchBtn");
const value = document.getElementById("country");
const vid = document.getElementById("vid");

const userCountry:any = document.getElementById("userCountry");
const currentDate:any = document.getElementById("currentDate");
const userTemperature:any = document.getElementById("userTemperature");
const floatDegree:any = document.getElementById("floatDegree");
const userWeatherDescription:any = document.getElementById("userWeatherDescription");

// weather info

const sunriseTime:any = document.getElementById("sunriseTime");
const sunsetTime:any = document.getElementById("sunsetTime");
const windSpeed:any = document.getElementById("windSpeed");

const getInfo = (url:string) => {
    fetch(url).then(res => res.json()).then(data => {console.log(data);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    findUserLocation();
})

getInfoBtn?.addEventListener("click", () => {
    // let val = (value as HTMLInputElement).value;
    // if(val.length != 0) {
    //     getInfo(`http://api.openweathermap.org/geo/1.0/direct?q=${val}&appid=${API_KEY}`);
    // }

    findUserLocation();
});

const userWeather = () => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${randomNumber(-180, 180)}&lon=${randomNumber(-180, 180)}&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data);
        
    })
}



const findUserLocation = () => {
    let lat, lon;
    // get and format date
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getUTCDate();
    const fullDate = `${day} ${month}`;
    // 
    const success = (position:any) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {
            userCountry.innerText = data.timezone;
            currentDate.innerText = fullDate;

            let parsed = data.current.temp.toString().split(".");

            userTemperature.innerText = parsed[0];
            floatDegree.innerText = `.${parsed[1]}°`;

            userWeatherDescription.innerText = data.current.weather[0].description;
            console.log(data);

            let sunriseH = new Date(data.current.sunrise).getHours();
            let sunriseM = new Date(data.current.sunrise).getMinutes();
            let sunrise = `${sunriseH}:${sunriseM} AM`;
            
            let sunsetH = new Date(data.current.sunset).getHours();
            let sunsetM = new Date(data.current.sunset).getMinutes();
            let sunset = `${sunsetH}:${sunsetM} PM`;
            
            sunriseTime.innerText = sunrise;
            sunsetTime.innerText = sunset;
            
            windSpeed.innerText = `${data.current.wind_speed}m/s`;
        });
    }
    const error = () => {
        console.log("unable");
    }
    navigator.geolocation.getCurrentPosition(success, error);
}

const randomNumber = (min:number, max:number) => {
    return Math.random() * (max - min) + min;
}