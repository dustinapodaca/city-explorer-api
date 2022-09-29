'use strict';

// Server Setup
// ====================

// Import modules
const express = require('express');
require('dotenv').config();
const { response } = require('express');

// ES6 - import express from 'express';
// ES6 - import cors from 'cors';

// Cors allows for Cross Origin Resource Sharing
const cors = require('cors'); // allow sfront end to make requests to back end

//Load modules
const getMovies = require('./modules/getMovies.js');
const getWeather = require('./modules/getWeather.js');

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
// Movie Endpoint
app.get('/movie', getMovies);

// Catch all endpoint: '*' has to be LAST.
app.get('*', () => {
  response.status(404).send('Page Not Found');
});

// OR

// app.get('*', notFound)

// function notFound(req, res) {
//   res.status(404).send('Page Not Found');
// }
