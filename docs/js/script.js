import { weatherAppApiKey, citiesApiKey } from "../../apikey.js";
const weatherIcons = ["bi-cloud", " bi-cloud-drizzle", "bi-cloud haze2", "bi-brightness-high-fill"];
const htmlSelectors = {
	city1: [$("#city1"), $("#weather1"), $("#minMaxTemp1")],
	city2: [$("#city2"), $("#weather2"), $("#minMaxTemp2")],
	city3: [$("#city3"), $("#weather3"), $("#minMaxTemp3")],
	city4: [$("#city4"), $("#weather4"), $("#minMaxTemp4")],
	city5: [$("#city5"), $("#weather5"), $("#minMaxTemp5")],
	cityMain: [$("#mainCity"), $("#weatherMain"), $("#minMaxTempMain")],
	citySearch: $("#searchInput"),
	searchButton: $("#searchBtn"),
};

if (
	htmlSelectors.searchButton.click(function (event) {
		event.preventDefault();

		let input = htmlSelectors.citySearch.val();

		fetch("https://api.api-ninjas.com/v1/city?name=" + input, {
			method: "GET",
			headers: {
				"X-Api-Key": citiesApiKey,
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error: " + response.status);
				}
				return response.json();
			})
			.then((result) => {
				// console.log(result);
				// console.log(result[0].latitude);
				// console.log(result[0].longitude);
				fetch(
					`https://api.openweathermap.org/data/2.5/weather?lat=${result[0].latitude}&lon=${result[0].longitude}&appid=${weatherAppApiKey}`
				)
					.then((response) => response.json())
					.then((weatherData) => {
						console.log(weatherData);
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