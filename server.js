'use strict';

// Server Setup
// ====================

// Import modules
const express = require('express');
require('dotenv').config();
// const axios = require('axios');

// cors allows for Cross Origin Resource Sharing
const cors = require('cors'); // allow sfront end to make requests to back end
// ES6 - import express from 'express';
// ES6 - import cors from 'cors';

//Load Data
// ====================
const data = require('./data/weather.json');
// const data = require('./data/data.json');

//Start Server
// =====================
const app = express();
// Declare our PORT variable
const PORT = process.env.PORT || 3001;
//Listening for connection
app.listen(PORT, () => console.log(`Listening on Port ${PORT}.`));
//Middleware
app.use(cors());

//Endpoints:
// =====================

app.get('/', (req, res) => {
  res.send('Hello from the home route.');
});

// Weather Endpoint
app.get('/weather', getWeather);

async function getWeather(req, res) {
  // const cityLocation = req.query.searchQuery; // note to use searchQuery on front end.
  const lat = req.query.lat;
  const lon = req.query.lon;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${req.query.lat}&lon=${req.query.lon}&days=5`;

  try {
    const weatherRes = await axios.get(url);
    let weatherData = data.find(location => location.lat && location.lon === lat && lon);
    let weatherForcast = [];
    weatherData.data.forEach(day => {
      let date = day.valid_date;
      let description = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`;
      weatherForcast.push(new Forecast(date, description));
    });
    res.status(200).send(weatherForcast);

  } catch (error) {
    res.status(500).send('Sorry, something went wrong.');
  }
};

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}


//Class 08

// app.get('/weather', getWeather);

// async function getWeather(req, res) {
//   const cityLocation = req.query.searchQuery; // note to use searchQuery on front end.
//   const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${req.query.lat}&lon=${req.query.lon}&days=8`;
//   try {
//     // const weatherRes = await axios.get(url);
//     const photoArray = weatherRes.data.results.map(photo => new Photo(photo));
//     res.status(200).send(photoArray);


//   } catch (error) {
//     console.log('error message: ', error);
//     res.status(500).send(`Sorry, something went wrong: ${error}`);
//   }
// };
// class Photo {
//   constructor(obj) {
//     this.img_url = obj.urls.regular;
//     this.photographer = obj.user.name;
//   }
// }

// Catch all endpoint: '*' has to be LAST.
app.get('*', (req, res) => {
  res.status(404).send('Page Not Found');
});

// OR

// app.get('*', notFound)

// function notFound(req, res) {
//   res.status(404).send('Page Not Found');
// }