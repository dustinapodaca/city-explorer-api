'use strict';

// Server Setup
// ====================
// Import modules

require('dotenv').config();
const express = require('express');

// cors allows for Cross Origin Resource Sharing
const cors = require('cors');
// ES6 - import express from 'express';
// ES6 - import cors from 'cors';

//Load Data
// ====================

const weather = require('./data/weather.json');
// const data = require('./data/data.json');

//Start Server
// =====================
const app = express();

//Middleware
app.use(cors());

// Declare our PORT variable
const PORT = process.env.PORT || 3001;

//Listening for connection
app.listen(PORT, () => console.log(`Listening or Port ${PORT}.`));


//Endpoints:
// =====================

app.get('/', (req, res) => {
  res.send('Hello from the home route.');
});

// Weather Endpoint
app.get('/weather', (req, res) => {
  try {
    const cityLocation = req.query.searchQuery;
    let weatherData = weather.find(location => location.city_name.toLowerCase() === cityLocation.toLowerCase());
    let weatherForcast = [];
    weatherData.data.forEach(day => {
      let date = day.datetime;
      let description = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`;
      weatherForcast.push(new Forecast(date, description));
      res.status(200).send(weatherForcast);
    });
    res.send(weatherForcast);

  } catch (error) {
    res.status(500).send('Sorry, something went wrong.');
  }
});

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

// Catch all endpoint:
app.get('*', (req, res) => {
  res.status(404).send('Page Not Found');
});
