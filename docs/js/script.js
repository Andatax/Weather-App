const apiKey = "e91ae94cc6f3044467c0535728f93ec9";

fetch(
	"http://api.openweathermap.org/geo/1.0/direct?q=MX-CMX​,MX&limit=2&appid=e91ae94cc6f3044467c0535728f93ec9"
)
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
	})
	.catch((error) => {
		console.log(`error: ${error}`);
	});
