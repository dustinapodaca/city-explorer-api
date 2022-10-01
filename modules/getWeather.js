'use strict';

const axios = require('axios');

// Load cache
//=================================================
const cache = require('./cache.js');

async function getWeather(req, res) {
  const cityLocation = req.query.searchQuery; // note to use searchQuery on front end.
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityLocation}&key=${process.env.WEATHER_API_KEY}&days=6`;
  console.log(url);
  try {
    //make conditional to check if cache has data
    const key = cityLocation + '_weather';
    //if the key exists in cache AND is valid, then send THAT data from cache
    if (cache[key] && (Date.now() - cache[key].timestamp < 1000 * 60 * 60 * 24)) {
      console.log('Cache was hit');
      res.status(200).send(cache[key].data);
    } else {
      console.log('Cache was missed');

      const weatherRes = await axios.get(url);
      console.log(weatherRes.data);

      //create a new object to store data and timestamp
      //===============================================
      const weatherData = weatherRes.data.data.map(day => new Forecast(
        day.datetime, 
        day.weather.description, 
        day.low_temp, 
        day.high_temp, 
        weatherRes.data.city_name,
        ));

      //OR
      // let weatherArray = [];
      // weatherRes.data.data.forEach(day => {
      //   let date = day.datetime;
      //   let description = day.weather.description;
      //   let low_temp = day.low_temp;
      //   let high_temp = day.high_temp;
      //   let city_name = weatherRes.data.city_name;
      //   weatherArray.push(new Forecast(date, description, low_temp, high_temp, city_name));
      // });
      // res.status(200).send(weatherArray);
      
      // Save to cache before data is sent to the client
      // Create a new object to store data and timestamp
      // =================================================

      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = weatherData;
      console.log('Cache is: ', cache);

      //OR
      // cache[key] = {
      //   timestamp: Date.now(),
      //   data: weatherData,
      // };

      //Send data to client
      res.status(200).send(weatherData);
    }

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