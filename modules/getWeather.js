'use strict';

const axios = require('axios');

async function getWeather(req, res) {
  const cityLocation = req.query.searchQuery; // note to use searchQuery on front end.
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityLocation}&key=${process.env.WEATHER_API_KEY}`;
  console.log(url);
  try {
    const weatherRes = await axios.get(url);
    console.log(weatherRes.data);

    let weatherArray = [];
    weatherRes.data.data.forEach(day => {
      let date = day.datetime;
      let description = day.weather.description;
      weatherArray.push(new Forecast(date, description));
    });
    res.status(200).send(weatherArray);

  } catch (error) {
    response.status(500).send('Sorry, something went wrong.');
  }
}

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

module.exports = getWeather;