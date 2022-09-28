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
app.get('/weather', (req, res) => {
  try {
    const cityLocation = req.query.searchQuery;
    let weatherData = data.find(location => location.city_name.toLowerCase() === cityLocation.toLowerCase());
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
});

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}



//Class 08

// app.get('/photos', getPhotos);

// async function getPhotos(req, res) {
//   const searchQuery = req.query.searchQuery; // note to use searchQuery on front end.
//   const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=${searchQuery}`;
//   try {
//     const photoResponse = await axios.get(url);
//     const photoArray = photoResponse.data.results.map(photo => new Photo(photo));
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