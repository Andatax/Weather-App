import { weatherAppApiKey, citiesApiKey } from "../../apikey.js";
const weatherIcons = {
	"04n": "bi-clouds",
	"04d": "bi-clouds",
	"09n": " bi-cloud-drizzle",
	"09d": "bi-cloud-drizzle",
	"10n": "bi-cloud-rain-heavy-fill",
	"10d": "bi-cloud-rain-heavy-fill",
	"01n": "bi-brightness-high-fill",
	"01d": "bi-brightness-high-fill",
	"02n": "bi-cloud-moon-fill",
	"02d": "bi-cloud-sun-fill",
	"03n": "bi-cloud-fill",
	"03d": "bi-cloud-fill",
	"11n": "bi-cloud-lightning-fill",
	"11d": "bi-cloud-lightning-fill",
	"13n": "bi-snow",
	"13d": "bi-snow",
	"50n": "bi-cloud-fog",
	"50d": "bi-cloud-fog",
};
const htmlSelectors = {
	day1: [
		$("#city1"),
		$("#weather1"),
		$("#weatherIcon1"),
		$("#temp1"),
		$("#minMaxTemp1"),
		$("#wind1"),
		$("#humidity1"),
	],
	day2: [
		$("#city2"),
		$("#weather2"),
		$("#weatherIcon2"),
		$("#temp2"),
		$("#minMaxTemp2"),
		$("#wind2"),
		$("#humidity2"),
	],
	day3: [
		$("#city3"),
		$("#weather3"),
		$("#weatherIcon3"),
		$("#temp3"),
		$("#minMaxTemp3"),
		$("#wind3"),
		$("#humidity3"),
	],
	day4: [
		$("#city4"),
		$("#weather4"),
		$("#weatherIcon4"),
		$("#temp4"),
		$("#minMaxTemp4"),
		$("#wind4"),
		$("#humidity4"),
	],
	day5: [
		$("#city5"),
		$("#weather5"),
		$("#weatherIcon5"),
		$("#temp5"),
		$("#minMaxTemp5"),
		$("#wind5"),
		$("#humidity5"),
	],
	dayMain: [
		$("#mainCity"),
		$("#weatherMain"),
		$("#weatherIconMain"),
		$("#tempMain"),
		$("#minMaxTempMain"),
		$("#windMain"),
		$("#humidityMain"),
	],
	citySearch: $("#searchInput"),
	searchButton: $("#searchBtn"),
};

if (
	htmlSelectors.searchButton.click(function (event) {
		event.preventDefault();

		let input = htmlSelectors.citySearch.val();
		console.log(input);
		fetch("https://api.api-ninjas.com/v1/city?name=" + input, {
			method: "GET",
			headers: {
				"X-Api-Key": citiesApiKey,
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((result) => {
				console.log(result);
				let lat = result[0].latitude ? result[0].latitude.toString() : null;
				let lon = result[0].longitude ? result[0].longitude.toString() : null;
				fetch(
					`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherAppApiKey}`
				)
					.then((response) => response.json())
					.then((weatherData) => {
						console.log(weatherData);
						htmlSelectors.day1[0].text(`${input}`);
						htmlSelectors.day1[1].text(weatherData.list[5].weather[0].description);

						// Adding icon by class to DOM not working
						let matchingKey = "";
						Object.keys(weatherIcons).forEach((keys) => {
							console.log(weatherData.list[5].weather[0].icon, keys);
							if (weatherData.list[5].weather[0].icon === keys) {
								matchingKey = Object.keys(weatherIcons).find((key) => weatherIcons[key] === keys);
								console.log("Matching Key:", matchingKey);
								htmlSelectors.day1[2].addClass(matchingKey);
								return;
							}
						});
						//--------------------------------------------------------------
						htmlSelectors.day1[3].text(
							"TEMPERATURE: " + Math.ceil(weatherData.list[5].main.temp - 273.15) + " °C"
						);
						htmlSelectors.day1[4].text(
							"MAX/MIN: " +
								Math.floor(weatherData.list[3].main.temp_max - 273.15) +
								" °C " +
								Math.ceil(weatherData.list[7].main.temp_min - 273.15) +
								" °C"
						);
						htmlSelectors.day1[5].text("WIND: " + Math.ceil(weatherData.list[5].wind.speed) + " m/s");
						htmlSelectors.day1[5].text(
							"HUMIDITY: " + Math.ceil(weatherData.list[5].main.humidity) + " %"
						);
					})
					.catch((error) => {
						console.log(`error: ${error}`);
					});
			})
			.then()
			.catch((error) => {
				console.error("Error: ", error);
			});
	})
);
