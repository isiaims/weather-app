import Icon from "./icons8-cloud-96.png";
import { Country, State, City } from "country-state-city";

const deg = ["<sup>o</sup>C", "<sup>o</sup>F"];
let degr = deg[0];
const speed = ["kph", "mph"];
let speedr = speed[0];

export function makeBodyElems() {
  const header = makeHeaderElems();
  const main = makeMainElems();
  const footer = document.createElement("footer");
  footer.innerHTML = `&copy;AimsDev`;

  document.body.append(header, main, footer);
  return { header, main };
}

function makeHeaderElems() {
  const header = document.createElement("header");
  const appName = document.createElement("h1");
  appName.innerHTML = "Weather App";
  const icon = document.createElement("img");
  icon.src = Icon;
  icon.alt = "cloud-icon";

  header.append(icon, appName);
  return header;
}

function makeMainElems() {
  const main = document.createElement("main");
  main.append(makeSearchElems(), makeMainContentElems());
  return main;
}

function makeSearchElems() {
  const locationDiv = document.createElement("div");
  const cityInput = document.createElement("input");
  cityInput.id = "city";
  cityInput.name = "city";
  cityInput.setAttribute("list", "cities");
  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchIcon.click();
    }
  });
  const dataList = document.createElement("datalist");
  dataList.id = "cities";
  getCountryCode().then((res) => {
    dataList.innerHTML = res.map(optData).join("");
  });
  const searchIcon = document.createElement("i");
  searchIcon.classList.add("fa-solid", "fa-magnifying-glass");
  searchIcon.addEventListener("click", setLocation);

  locationDiv.append(cityInput, dataList, searchIcon);
  return locationDiv;
}
function optData(i) {
  return `<option value=${i.name}>${
    Country.getCountryByCode(i.countryCode).name
  }, ${
    State.getStateByCodeAndCountry(i.stateCode, i.countryCode).name
  }</option>`;
}
function makeMainContentElems() {
  const contentDiv = document.createElement("div");
  contentDiv.classList.add("content-div");
  const location = makeInfoElems("zaria").locationDiv;
  const info = makeInfoElems("zaria").infoDiv;
  const forecast = makeInfoElems("zaria").forecastDiv;

  contentDiv.append(location, info, forecast);
  return contentDiv;
}
function populateForecast(i) {
  let dataDate = new Date(i.date);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dataDate.getDay()];
  dataDate.getDate() === new Date().getDate() ? (day = "Today") : "";
  return `
          <div>
              <p>${day}</p>
              <img src=${i.day.condition.icon} ></img>
              <p>High: ${i.day.maxtemp_c}${degr}</p>
              <p>Low: ${i.day.mintemp_c}${degr}</p>
              <p>Chance of Rain: ${i.day.daily_chance_of_rain}%</p>
          </div>
      `;
}
function makeInfoElems(local) {
  // Location
  const locationDiv = document.createElement("div");
  locationDiv.classList.add("location");
  const city = document.createElement("h1");
  const location = document.createElement("p");
  locationDiv.append(city, location);

  // WeatherInfo
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("info");
  const summaryDiv = document.createElement("div");
  summaryDiv.classList.add("summary-div");
  const weatherImg = document.createElement("img");
  const weatherSummaryDiv = document.createElement("div");
  const temp = document.createElement("h2");
  const weatherText = document.createElement("h3");
  const weatherPeaks = document.createElement("p");
  const chanceOfRain = document.createElement("p");
  const otherInfosDiv = document.createElement("div");
  otherInfosDiv.classList.add("details");
  const feels = document.createElement("p");
  const humidity = document.createElement("p");
  const windDeg = document.createElement("p");
  const windDir = document.createElement("p");
  const windSpeed = document.createElement("p");
  const maxWindSpeed = document.createElement("p");
  const uv = document.createElement("p");

  weatherSummaryDiv.append(temp, weatherText, weatherPeaks, chanceOfRain);
  summaryDiv.append(weatherImg, weatherSummaryDiv);
  otherInfosDiv.append(
    feels,
    humidity,
    windSpeed,
    windDir,
    windDeg,
    maxWindSpeed,
    uv
  );
  infoDiv.append(summaryDiv, otherInfosDiv);

  // Forecast
  const forecastDiv = document.createElement("div");
  forecastDiv.classList.add("forecast");

  getWeather(local).then((res) => {
    city.innerHTML = res.location.name.toUpperCase();
    location.innerHTML = `${res.location.region}, 
    ${res.location.country}`;
    weatherImg.src = res.current.condition.icon;
    temp.innerHTML = `${res.current.temp_c}${degr}`;
    weatherText.innerHTML = res.current.condition.text;
    weatherPeaks.innerHTML = `<b>High</b>: ${res.forecast.forecastday[0].day.maxtemp_c}${degr} 
    <b>Low</b>: ${res.forecast.forecastday[0].day.mintemp_c}${degr}`;
    chanceOfRain.innerHTML = `<b>Chance of rain</b>: ${res.forecast.forecastday[0].day.daily_chance_of_rain}%`;
    feels.innerHTML = `Feels Like: ${res.current.feelslike_c}${degr}`;
    humidity.innerHTML = "Humidity: " + res.current.humidity + "%";
    windDeg.innerHTML =
      "Wind Degree: " + res.current.wind_degree + `<sup>o</sup>`;
    windDir.innerHTML = "Wind Direction: " + res.current.wind_dir;
    windSpeed.innerHTML = "Wind Speed: " + res.current.wind_kph + speedr;
    maxWindSpeed.innerHTML = `Max-Wind-Speed: ${res.forecast.forecastday[0].day.maxwind_kph}${speedr}`;
    uv.innerHTML = "UV Index: " + res.forecast.forecastday[0].day.uv;
    forecastDiv.innerHTML = res.forecast.forecastday
      .map(populateForecast)
      .join("");

    getGif(res.current.condition.text)
      .then((gif) => {
        otherInfosDiv.style.backgroundImage = `URL(${gif.data.images.original.url})`;
        otherInfosDiv
          .querySelectorAll("p")
          .forEach((i) => (i.style.background = "aqua"));
        otherInfosDiv.style.color = "crimson";
      })
      .catch((err) => {
        otherInfosDiv.style.background = "aqua";
        otherInfosDiv
          .querySelectorAll("p")
          .forEach((i) => (i.style.background = "aliceblue"));
        otherInfosDiv.style.color = "crimson";
        console.log("Error:" + err);
      });
  });

  return { locationDiv, infoDiv, forecastDiv };
}
function setLocation() {
  const div = document.querySelector(".content-div");
  div.innerHTML = "";
  const input = document.querySelector("input");
  const location = input.value;
  if (location === "") return;
  div.append(
    makeInfoElems(location).locationDiv,
    makeInfoElems(location).infoDiv,
    makeInfoElems(location).forecastDiv
  );
}
async function getCountryCode() {
  const state = Intl.DateTimeFormat().resolvedOptions().timeZone.split("/")[1];
  let code;
  State.getAllStates().find((i) => {
    i.name === state ? (code = i.countryCode) : "";
  });
  return City.getCitiesOfCountry(code);
}

// API
async function getWeather(area) {
  let response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=23c6a6c898df4993a1564804240105&q=${area}&days=5&aqi=no&alerts=no`
  );
  let data = await response.json();

  return data;
}

async function getGif(weather) {
  let response = await fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=MYc5XILPK6kjfK2MzeEE1t11gS6ucycy&s=${weather}+sky&weirdness=1`
  );
  let data = await response.json();

  return data;
}
