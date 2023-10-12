const weatherAppApiKey = 'fe0b392100981c0ca23437f4c874b5e8';
const citiesApiKey = 'UV6648NeZT4RY5GoyCFnDSijoyoNqcMMuF33K3fD';

// Define an object that maps weather icons to their corresponding CSS classes
const weatherIcons = {
	'04n': 'bi-clouds',
	'04d': 'bi-clouds',
	'09n': ' bi-cloud-drizzle',
	'09d': 'bi-cloud-drizzle',
	'10n': 'bi-cloud-rain-heavy-fill',
	'10d': 'bi-cloud-rain-heavy-fill',
	'01n': 'bi-brightness-high-fill',
	'01d': 'bi-brightness-high-fill',
	'02n': 'bi-cloud-moon-fill',
	'02d': 'bi-cloud-sun-fill',
	'03n': 'bi-cloud-fill',
	'03d': 'bi-cloud-fill',
	'11n': 'bi-cloud-lightning-fill',
	'11d': 'bi-cloud-lightning-fill',
	'13n': 'bi-snow',
	'13d': 'bi-snow',
	'50n': 'bi-cloud-fog',
	'50d': 'bi-cloud-fog',
};

// Define an object that stores HTML selectors for various elements on the page
// These selectors are used to update the HTML elements with the corresponding data
const htmlSelectors = {
	day1: [
		$('#day1'),
		$('#weather1'),
		$('#weatherIcon1'),
		$('#temp1'),
		$('#minMaxTemp1'),
		$('#wind1'),
		$('#humidity1'),
	],
	day2: [
		$('#day2'),
		$('#weather2'),
		$('#weatherIcon2'),
		$('#temp2'),
		$('#minMaxTemp2'),
		$('#wind2'),
		$('#humidity2'),
	],
	day3: [
		$('#day3'),
		$('#weather3'),
		$('#weatherIcon3'),
		$('#temp3'),
		$('#minMaxTemp3'),
		$('#wind3'),
		$('#humidity3'),
	],
	day4: [
		$('#day4'),
		$('#weather4'),
		$('#weatherIcon4'),
		$('#temp4'),
		$('#minMaxTemp4'),
		$('#wind4'),
		$('#humidity4'),
	],
	day5: [
		$('#day5'),
		$('#weather5'),
		$('#weatherIcon5'),
		$('#temp5'),
		$('#minMaxTemp5'),
		$('#wind5'),
		$('#humidity5'),
	],
	dayMain: [
		$('#mainDay'),
		$('#weatherMain'),
		$('#weatherIconMain'),
		$('#tempMain'),
		$('#minMaxTempMain'),
		$('#windMain'),
		$('#humidityMain'),
	],
	citySearch: $('#searchInput'),
	searchButton: $('#searchBtn'),
};

if (
	htmlSelectors.searchButton.click(function (event) {
		event.preventDefault();

		let input = htmlSelectors.citySearch.val();
		// console.log(input);

		// Make a request to the cities API to get the latitude and longitude of the input city

		fetch('https://api.api-ninjas.com/v1/city?name=' + input, {
			method: 'GET',
			headers: {
				'X-Api-Key': citiesApiKey,
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((result) => {
				// console.log(result);

				// Extract the latitude and longitude from the API response

				let lat = result[0].latitude ? result[0].latitude.toString() : null;
				let lon = result[0].longitude ? result[0].longitude.toString() : null;
				fetch(
					`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherAppApiKey}`
				)
					.then((response) => response.json())
					.then((weatherData) => {
						// Update weather card for each day
						updateWeatherCard(weatherData, 5, 1);
						updateWeatherCard(weatherData, 13, 2);
						updateWeatherCard(weatherData, 21, 3);
						updateWeatherCard(weatherData, 29, 4);
						updateWeatherCard(weatherData, 37, 5);
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
							'TEMPERATURE: ' + Math.ceil(currentWeatherData.main.temp - 273.15) + ' °C'
						);
						htmlSelectors.dayMain[4].text(
							'MAX/MIN: ' +
								Math.floor(currentWeatherData.main.temp_max - 273.15) +
								' °C ' +
								Math.ceil(currentWeatherData.main.temp_min - 273.15) +
								' °C'
						);
						htmlSelectors.dayMain[5].text('WIND: ' + Math.ceil(currentWeatherData.wind.speed) + ' m/s');
						htmlSelectors.dayMain[6].text(
							'HUMIDITY: ' + Math.ceil(currentWeatherData.main.humidity) + ' %'
						);
					})
					.catch((error) => {
						console.log(`error: ${error}`);
					});
			})
			.then()
			.catch((error) => {
				console.error('Error: ', error);
			});
	})
);

const updateWeatherCard = (weatherData, listIndex, dayIndex) => {
	console.log(weatherData);
	let date = weatherData.list[listIndex].dt;
	htmlSelectors[`day${dayIndex}`][0].text(`${timeConverter(date)}`);
	htmlSelectors[`day${dayIndex}`][1].text(
		weatherData.list[listIndex].weather[0].description.toUpperCase()
	);
	for (const key in weatherIcons) {
		if (key === weatherData.list[listIndex].weather[0].icon) {
			// console.log(key);
			let icon = weatherIcons[key];
			htmlSelectors[`day${dayIndex}`][2].addClass(icon.toString());
		}
	}
	htmlSelectors[`day${dayIndex}`][3].text(
		'TEMPERATURE: ' + Math.ceil(weatherData.list[listIndex].main.temp - 273.15) + ' °C'
	);
	htmlSelectors[`day${dayIndex}`][4].text(
		'MAX/MIN: ' +
			Math.floor(weatherData.list[listIndex - 2].main.temp_max - 273.15) +
			' °C ' +
			Math.ceil(weatherData.list[listIndex + 2].main.temp_min - 273.15) +
			' °C'
	);
	htmlSelectors[`day${dayIndex}`][5].text(
		'WIND: ' + Math.ceil(weatherData.list[listIndex].wind.speed) + ' m/s'
	);
	htmlSelectors[`day${dayIndex}`][6].text(
		'HUMIDITY: ' + Math.ceil(weatherData.list[listIndex].main.humidity) + ' %'
	);
};

// Converts a UNIX timestamp to a formatted date string
// Main part of the function timeConverter was taken from stack overflow and it was adapted to my code and my logic
function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp * 1000);
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var day = a.getDate();
	var date = day + ' ' + month + ', ' + year;
	return date;
}
