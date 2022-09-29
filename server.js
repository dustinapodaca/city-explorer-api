'use strict';

// Server Setup
// ====================

// Import modules
const express = require('express');
require('dotenv').config();
const { response } = require('express');
const axios = require('axios');
// ES6 - import express from 'express';
// ES6 - import cors from 'cors';

// Cors allows for Cross Origin Resource Sharing
const cors = require('cors'); // allow sfront end to make requests to back end

//Load Data
// ====================
// const data = require('./data/weather.json');
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
  const cityLocation = req.query.searchQuery; // note to use searchQuery on front end.
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&city=${cityLocation}&days=5`;

  console.log(url);
  try {
    const weatherRes = await axios.get(url);
    console.log(weatherRes.data);
    
    let weatherForcast = [];
    weatherRes.data.data.forEach(day => {
      let date = day.valid_date;
      let description = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`;
      weatherForcast.push(new Forecast(date, description));
    });
    res.status(200).send(weatherForcast);

  } catch (error) {
    response.status(500).send('Sorry, something went wrong.');
  }
};

app.get('/movie', getMovies);

async function getMovies(req, res) {
  const cityLocation = req.query.query; // note to use query on front end.
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityLocation}`;
  console.log(url);
  try {
    const movieRes = await axios.get(url);
    console.log(movieRes.data);

    let movieArray = [];
    movieRes.data.results.forEach(movie => {
      let title = movie.title;
      let overview = movie.overview;
      let vote_average = movie.vote_average;
      let vote_count = movie.vote_count;
      let poster_path = movie.poster_path;
      let popularity = movie.popularity;
      let release_date = movie.release_date;
      movieArray.push(new Movie(title, overview, vote_average, vote_count, poster_path, popularity, release_date));
    });
    res.status(200).send(movieArray);

  } catch (error) {
    response.status(500).send('Sorry, something went wrong.');
  }
};

class Movie {
  constructor(title, overview, vote_average, vote_count, poster_path, popularity, release_date) {
    this.title = title;
    this.overview = overview;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
    this.poster_path = 'https://image.tmdb.org/t/p/w500' + poster_path;
    this.popularity = popularity;
    this.release_date = release_date;
  }
}
class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

// Catch all endpoint: '*' has to be LAST.
app.get('*', (req, res) => {
  response.status(404).send('Page Not Found');
});

// OR

// app.get('*', notFound)

// function notFound(req, res) {
//   res.status(404).send('Page Not Found');
// }


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

// Class 09
// const getPhotos = require('./modules/getPhotos.js');

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

