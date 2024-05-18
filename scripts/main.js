const currentTempElement = document.getElementById("current-temp");
const minT = document.getElementById("minT");
const maxT = document.getElementById("maxT");
const prec = document.getElementById('prec');
const API_KEY = "cHUT2O6QnIEqP8YWYBSFBJTDPWczIFJ7";
navigator.geolocation.watchPosition(async (position) => {
    const { latitude: lat, longitude: long } = position.coords;
    console.log(lat);
    console.log(long);
    const weatherData = await getWeather(lat, long);
    console.log(weatherData);
    currentTempElement.innerText = `${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}`;
    minT.innerText = `${weatherData.daily.temperature_2m_min} ${weatherData.daily_units.temperature_2m_min}`;
    maxT.innerText = `${weatherData.daily.temperature_2m_max} ${weatherData.daily_units.temperature_2m_max}`;
    prec.innerText = `${weatherData.current.precipitation} ${weatherData.current_units.precipitation}`
    const reverseURL = new URL("/v2/reverse", "http://api.geocodify.com");
    reverseURL.searchParams.set("api_key", API_KEY);
    reverseURL.searchParams.set("lng", long);
    reverseURL.searchParams.set("lat", lat);
    const response = await fetch(reverseURL);
    if (response.ok) {
        const geoData = await response.json();
        console.log(geoData);
        geoData.response.features.sort((a, b) => {
            return a.properties.distance - b.properties.distance;
        });
        document.getElementById('city').innerText = geoData.response.features[0].properties.name;
    }
});

async function getWeather(lat, long) {
    const url = new URL("/v1/forecast", "https://api.open-meteo.com");
    url.searchParams.set("latitude", lat);
    url.searchParams.set("longitude", long);
    url.searchParams.set("current", "temperature_2m,is_day,precipitation,rain,showers,snowfall,cloud_cover");
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
    url.searchParams.set("forecast_days", "1");
    const request = new Request(url);
    const response = await fetch(request);
    if (response.ok) {
        return response.json();
    } else throw new Error("Network Error");
}