const express = require("express"); // require express
const https = require("https");
// const apiKey = require("./keys").apiKey; // import weather api key from git-ignored file
const bodyParser = require("body-parser"); // bodyparser allows to look through the body of the post request and fetch data based on the name of my input (e.g. cityName)

const app = express(); // initialize a new express app

app.use(bodyParser.urlencoded({
    extended: true
})); // necessary code to start parsing through the body of the post request.

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    // console.log(req.body.cityName);
    const query = req.body.cityName;
    const apiKey ="1a32c23f54f46653c6f94344eb699562";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit + "";

    https.get(url, function (response) {
        console.log("status code: " + response.statusCode);

        response.on("data", function (data) {
            // console.log(data); //will show hexadecimal code for the json data. It would be more useful to have a JS object, like this:
            const weatherData = JSON.parse(data); // recreate js object with JSON.parse.
            const temp = weatherData.main.temp; // extract specific pieces of information, e.g. temperature. chrome extension "json viewer pro" HELPS getting full paths.
            const weatherDescription = weatherData.weather[0].description; // extract specific pieces of information, e.g. temperature. chrome extension "json viewer pro" HELPS getting full paths.
            const icon = weatherData.weather[0].icon;
            const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<h1>The weather is currently " + weatherDescription + ".</h1>");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celsius.</h1>");
            res.write("<img src=" + iconUrl + ">");
            res.send();
        });
    });
});

app.listen(3000, function () {
    console.log("The server is running on port 3000");
});