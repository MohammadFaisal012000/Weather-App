const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const badReq = document.querySelector(".bad");

// initial variable

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      // searchForm is invisible then make it visible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // switching from search tab to weather tab
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //   we come in YourWeather then we display YourWeather , so let check local storage first
      // for coordinates, if we have saved them there
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

// check if coordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    // if we have no ocal coordinate
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // make grantContainer invisible
  grantAccessContainer.classList.remove("active");
  // make Loader Visible
  loadingScreen.classList.add("active");

  // API Call
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}  `
    );
    let data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    // 404 error image shows
  }
}

function renderWeatherInfo(data) {
  // fetching
  let city = document.querySelector("[data-cityName]");
  let flag = document.querySelector("[data-countryIcon]");
  let weatherDesc = document.querySelector("[data-weatherDesc]");
  let weatherIcon = document.querySelector("[data-weatherIcon]");
  let temp = document.querySelector("[data-temp]");
  let windSpeed = document.querySelector("[data-windspeed]");
  let humidity = document.querySelector("[data-humidity]");
  let cloud = document.querySelector("[data-cloudiness]");

  //  Show

  city.innerText = data?.name;
  flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  weatherDesc.innerText = data?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
  temp.innerText = `${data?.main?.temp} °C`;
  windSpeed.innerText = `${data?.wind?.speed}m/s`;
  humidity.innerText = `${data?.main?.humidity}%`;
  cloud.innerText = `${data?.clouds?.all}%`;

  console.log(cityName, windSpeed, humidity, cloud, flag);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    console.log("GetLocation");
  } else {
    // Sow an alert for no geoLocation Support
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  if (cityName === "") {
    return;
  } else {
    fetchSearchWeatherInfo(cityName);
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    let data = await response.json();
    loadingScreen.classList.remove("active");
    // userInfoContainer.classList.add("active");
    badReq.classList.remove("active");

    console.log(data);
    if (data.cod !== "404") {
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);

      // badReq.classList.remove("active");
    } else {
      badReq.classList.add("active");
    }
  } catch (error) {
    // show image of 404 bad error comes
    // badReq.classList.add("active");
  }
}
