'use strict';

const axios = require('axios');

async function getWeather(req, res) {
  const cityLocation = req.query.searchQuery; // note to use searchQuery on front end.
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityLocation}&key=${process.env.WEATHER_API_KEY}&days=6`;
  console.log(url);
  try {
    const weatherRes = await axios.get(url);
    console.log(weatherRes.data);

    let weatherArray = [];
    weatherRes.data.data.forEach(day => {
      let date = day.datetime;
      let description = day.weather.description;
      let low_temp = day.low_temp;
      let high_temp = day.high_temp;
      let city_name = weatherRes.data.city_name;
      weatherArray.push(new Forecast(date, description, low_temp, high_temp, city_name));
    });
    res.status(200).send(weatherArray);

  } catch (error) {
    response.status(500).send('Sorry, something went wrong.');
  }
}

class Forecast {
  constructor(date, description, low_temp, high_temp, city_name) {
    this.date = date;
    this.description = description;
    this.low_temp = low_temp;
    this.high_temp = high_temp;
    this.city_name = city_name;

  }
}

module.exports = getWeather;