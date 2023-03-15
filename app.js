// VARIABLES

const apiKey = "44243e31c4c3fc00087534ec814dd36c"

const form = document.querySelector("#form");
const inputCity = document.querySelector("#inputCity");
const cityName = document.querySelector("#cityName");
const temperature = document.querySelector("#temperature");
const description = document.querySelector("#description");
const humidity = document.querySelector("#humidity");
const feelsLike = document.querySelector("#feelsLike");
const wind = document.querySelector("#wind");
const dayForecast = document.querySelector("#dayforecast");
const tempMaxForecast = document.querySelector("#tempMaxForecast");
const tempMinForecast = document.querySelector("#tempMinForecast");
const errorMessage = document.querySelector("#errorMessage");
const forecastTitle = document.querySelector("#forecastTitle");
const iconForecast = document.querySelector("#iconForecast");
const fragment = document.createDocumentFragment();

const containerMain = document.querySelector("#containerMain");
const containerForecast = document.querySelector("#containerForecast");

const templateMain = document.querySelector("#templateMain");
const templateForecast = document.querySelector("#templateForecast");
const templateError = document.querySelector("#templateError");

// Function API call

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = inputCity.value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;


    try {
        const response = await fetch(url);
        const data = await response.json();
        const responseForecast = await fetch(forecastUrl);
        const dataForecast = await responseForecast.json();

        showDataMain(data);
        showDataForecast(dataForecast)
    } catch {
        showError()
    }

})

// Function to show data

const showDataMain = (data) => {

    // Reset the content of the template and city name for avoid overwriting

    containerMain.textContent = '';
    cityName.textContent = "";

    // Main Section

    const clone = templateMain.content.cloneNode(true);
    const iconCode = data.weather[0].icon;

    clone.querySelector("#icon").src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    clone.querySelector("#temperature").textContent = data.main.temp + "°C";
    clone.querySelector("#description").textContent = data.weather[0].description;
    clone.querySelector("#humidity").textContent = data.main.humidity + "%";
    clone.querySelector("#feelsLike").textContent = data.main.feels_like + "°C";
    clone.querySelector("#wind").textContent = data.wind.speed + "km/h";
    cityName.textContent = inputCity.value;
    cityName.classList.remove("d-none");
    templateError.classList.add("d-none")

    fragment.appendChild(clone);
    containerMain.appendChild(fragment);
}

const showDataForecast = (data) => {
    containerForecast.classList.remove("d-none");

    const getDayOfWeek = (timestamp) => {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date(timestamp * 1000);
        const dayOfWeek = daysOfWeek[date.getDay()];
        return dayOfWeek;
    };

    const forecastData = data.list;
    let currentDay = null;

    forecastData.forEach((item) => {
        const day = getDayOfWeek(item.dt);

        if (day !== currentDay) {
            currentDay = day;
            const clone = templateForecast.content.cloneNode(true);
            const iconCode = item.weather[0].icon;
            clone.querySelector("#iconForecast").src = `https://openweathermap.org/img/wn/${iconCode}.png`;
            clone.querySelector("#dayForecast").textContent = day;
            clone.querySelector("#tempMaxForecast").textContent = item.main.temp_max.toFixed(0) + "°C";
            clone.querySelector("#tempMinForecast").textContent = item.main.temp_min.toFixed(0) + "°C";
            fragment.appendChild(clone);
        }
    });

    forecastTitle.classList.remove("d-none")
    containerForecast.appendChild(fragment);
};

const showError = () => {
    templateError.classList.remove("d-none");
    containerForecast.classList.add("d-none")
}


