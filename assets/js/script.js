const weatherAppApiKey = "fe0b392100981c0ca23437f4c874b5e8";
const citiesApiKey = "UV6648NeZT4RY5GoyCFnDSijoyoNqcMMuF33K3fD";

// Define an object that maps weather icons to their corresponding CSS classes
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

// Define an object that stores HTML selectors for various elements on the page
// These selectors are used to update the HTML elements with the corresponding data
const htmlSelectors = {
	day1: [
		$("#day1"),
		$("#weather1"),
		$("#weatherIcon1"),
		$("#temp1"),
		$("#minMaxTemp1"),
		$("#wind1"),
		$("#humidity1"),
	],
	day2: [
		$("#day2"),
		$("#weather2"),
		$("#weatherIcon2"),
		$("#temp2"),
		$("#minMaxTemp2"),
		$("#wind2"),
		$("#humidity2"),
	],
	day3: [
		$("#day3"),
		$("#weather3"),
		$("#weatherIcon3"),
		$("#temp3"),
		$("#minMaxTemp3"),
		$("#wind3"),
		$("#humidity3"),
	],
	day4: [
		$("#day4"),
		$("#weather4"),
		$("#weatherIcon4"),
		$("#temp4"),
		$("#minMaxTemp4"),
		$("#wind4"),
		$("#humidity4"),
	],
	day5: [
		$("#day5"),
		$("#weather5"),
		$("#weatherIcon5"),
		$("#temp5"),
		$("#minMaxTemp5"),
		$("#wind5"),
		$("#humidity5"),
	],
	dayMain: [
		$("#mainDay"),
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
		// console.log(input);

		// Make a request to the cities API to get the latitude and longitude of the input city

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
				// console.log(result);
				if (result.length === 0) {
					alert("City not found, please try again");
				}
				// Extract the latitude and longitude from the API response

				let lat = result[0].latitude ? result[0].latitude.toString() : null;
				let lon = result[0].longitude ? result[0].longitude.toString() : null;
				fetch(
					`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherAppApiKey}`
				)
					.then((response) => response.json())
					.then((weatherData) => {
						// Update weather card for each day
						for (let i = 0; i < 5; i++) {
							let index = 5 + i * 8;
							let dayi = i + 1;
							updateWeatherCard(weatherData, index, dayi);
						}
					})
					.catch((error) => {
						console.log(`error: ${error}`);
					});
				fetch(
					`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAppApiKey}`
				)
					.then((response) => response.json())
					.then((currentWeatherData) => {
						console.log(currentWeatherData);
						htmlSelectors.dayMain[0].text(`${result[0].name.toUpperCase()}`);
						htmlSelectors.dayMain[1].text(`${currentWeatherData.weather[0].description.toUpperCase()}`);
						for (const key in weatherIcons) {
							if (key === currentWeatherData.weather[0].icon) {
								// console.log(key);
								let icon = weatherIcons[key];
								htmlSelectors.dayMain[2].addClass(icon.toString());
							}
						}
						htmlSelectors.dayMain[3].text(
							"TEMPERATURE: " + Math.ceil(currentWeatherData.main.temp - 273.15) + " °C"
						);
						htmlSelectors.dayMain[4].text(
							"MAX/MIN: " +
								Math.floor(currentWeatherData.main.temp_max - 273.15) +
								" °C " +
								Math.ceil(currentWeatherData.main.temp_min - 273.15) +
								" °C"
						);
						htmlSelectors.dayMain[5].text("WIND: " + Math.ceil(currentWeatherData.wind.speed) + " m/s");
						htmlSelectors.dayMain[6].text(
							"HUMIDITY: " + Math.ceil(currentWeatherData.main.humidity) + " %"
						);
						const mainCardData = {
							name: result[0].name.toUpperCase(),
							description: currentWeatherData.weather[0].description.toUpperCase(),
							temperature: Math.ceil(currentWeatherData.main.temp - 273.15),
							maxTemperature: Math.floor(currentWeatherData.main.temp_max - 273.15),
							minTemperature: Math.ceil(currentWeatherData.main.temp_min - 273.15),
							windSpeed: Math.ceil(currentWeatherData.wind.speed),
							humidity: Math.ceil(currentWeatherData.main.humidity),
						};
						window.localStorage.setItem("mainCardData", JSON.stringify(mainCardData));
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
htmlSelectors.searchButton.click(function (event) {
	event.preventDefault();

	clearScoresLocalStorage("savedCards");
	clearScoresLocalStorage("mainCardData");
});

const updateWeatherCard = (weatherData, listIndex, dayIndex) => {
	const temperature = Math.ceil(weatherData.list[listIndex].main.temp - 273.15);
	const maxTemperature = Math.floor(weatherData.list[listIndex - 2].main.temp_max - 273.15);
	const minTemperature = Math.ceil(weatherData.list[listIndex + 2].main.temp_min - 273.15);
	const windSpeed = Math.ceil(weatherData.list[listIndex].wind.speed);
	const humidity = Math.ceil(weatherData.list[listIndex].main.humidity);
	const description = weatherData.list[listIndex].weather[0].description.toUpperCase();
	const date = timeConverter(weatherData.list[listIndex].dt);
	let icon = "";

	for (const key in weatherIcons) {
		if (key === weatherData.list[listIndex].weather[0].icon) {
			icon = weatherIcons[key];
			htmlSelectors[`day${dayIndex}`][2].addClass(icon.toString());
			break;
		}
	}

	const cardData = {
		temperature,
		maxTemperature,
		minTemperature,
		windSpeed,
		humidity,
		description,
		date,
		icon,
	};
	saveCards(cardData);
	htmlSelectors[`day${dayIndex}`][0].text(date);
	htmlSelectors[`day${dayIndex}`][1].text(description);
	htmlSelectors[`day${dayIndex}`][2].addClass(icon.toString());
	htmlSelectors[`day${dayIndex}`][3].text("TEMPERATURE: " + temperature + " °C");
	htmlSelectors[`day${dayIndex}`][4].text(
		"MAX/MIN: " + maxTemperature + " °C " + minTemperature + " °C"
	);
	htmlSelectors[`day${dayIndex}`][5].text("WIND: " + windSpeed + " m/s");
	htmlSelectors[`day${dayIndex}`][6].text("HUMIDITY: " + humidity + " %");
};

let saveCards = (cardData) => {
	let savedCards = JSON.parse(window.localStorage.getItem("savedCards")) || [];
	savedCards.push(cardData);
	window.localStorage.setItem("savedCards", JSON.stringify(savedCards));
};

const clearScoresLocalStorage = (keydata) => {
	window.localStorage.removeItem(`${keydata}`);
};

const displayStoredData = () => {
	const savedCards = JSON.parse(localStorage.getItem("savedCards"));
	const mainCardData = JSON.parse(localStorage.getItem("mainCardData"));

	if (savedCards) {
		// Loop through each saved card data and update the corresponding DOM elements
		savedCards.forEach((cardData, index) => {
			const dayIndex = index + 1;
			const cardSelectors = htmlSelectors[`day${dayIndex}`];
			const {
				temperature,
				maxTemperature,
				minTemperature,
				windSpeed,
				humidity,
				description,
				date,
				icon,
			} = cardData;

			cardSelectors[0].text(date);
			cardSelectors[1].text(description);
			cardSelectors[2].removeClass().addClass(icon.toString());
			cardSelectors[3].text("TEMPERATURE: " + temperature + " °C");
			cardSelectors[4].text("MAX/MIN: " + maxTemperature + " °C " + minTemperature + " °C");
			cardSelectors[5].text("WIND: " + windSpeed + " m/s");
			cardSelectors[6].text("HUMIDITY: " + humidity + " %");
		});
	}

	if (mainCardData) {
		const mainCardSelectors = htmlSelectors.dayMain;
		const { name, description, temperature, maxTemperature, minTemperature, windSpeed, humidity } =
			mainCardData;

		mainCardSelectors[0].text(name);
		mainCardSelectors[1].text(description);
		mainCardSelectors[2].removeClass().addClass(weatherIcons[description.toLowerCase()]);
		mainCardSelectors[3].text("TEMPERATURE: " + temperature + " °C");
		mainCardSelectors[4].text("MAX/MIN: " + maxTemperature + " °C " + minTemperature + " °C");
		mainCardSelectors[5].text("WIND: " + windSpeed + " m/s");
		mainCardSelectors[6].text("HUMIDITY: " + humidity + " %");
	}
};

// Call the function to display the stored data in the DOM cards
displayStoredData();
// Converts a UNIX timestamp to a formatted date string
// Main part of the function timeConverter was taken from stack overflow and it was adapted to my code and my logic
function timeConverter(UNIX_timestamp) {
	let a = new Date(UNIX_timestamp * 1000);
	let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	let year = a.getFullYear();
	let month = months[a.getMonth()];
	let day = a.getDate();
	let date = day + " " + month + ", " + year;
	return date;
}
