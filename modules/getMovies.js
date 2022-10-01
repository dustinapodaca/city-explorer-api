'use strict';

const axios = require('axios');

// Load cache
//=================================================
const cache = require('./cache.js');

async function getMovies(req, res) {
  const cityLocation = req.query.query; // note to use query on front end.
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityLocation}&page=1&include_adult=false`;
  console.log(url);
  try {
    //make conditional to check if cache has data
    const key = cityLocation + '_movie';
    //if the key exists in cache AND is valid, then send THAT data from cache
    if (cache[key] && (Date.now() - cache[key].timestamp < 1000 * 60 * 60 * 24)) {
      console.log('Cache was hit');
      res.status(200).send(cache[key].data);
    } else {
      console.log('Cache was missed');
      const movieRes = await axios.get(url);
      console.log(movieRes.data);

      //create a new object to store data and timestamp
      //===============================================

      const movieData = movieRes.data.results.map(movie => new Movie(
        movie.title,
        movie.overview,
        movie.vote_average,
        movie.vote_count,
        movie.poster_path,
        movie.popularity,
        movie.release_date
      ));

      //OR
      // let movieArray = [];
      // movieRes.data.results.forEach(movie => {
      //   let title = movie.title;
      //   let overview = movie.overview;
      //   let vote_average = movie.vote_average;
      //   let vote_count = movie.vote_count;
      //   let poster_path = movie.poster_path;
      //   let popularity = movie.popularity;
      //   let release_date = movie.release_date;
      //   movieArray.push(new Movie(title, overview, vote_average, vote_count, poster_path, popularity, release_date));
      // });
      // res.status(200).send(movieArray);

      // Save to cache before data is sent to the client
      // Create a new object to store data and timestamp
      // =================================================

      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = movieData;
      console.log('Cache is: ', cache);

      //OR
      // cache[key] = {
      //   timestamp: Date.now(),
      //   data: movieData,
      // };
      
      // Send data to client 
      res.status(200).send(movieData);
    }

  } catch (error) {
    response.status(500).send('Sorry, something went wrong.');
  }
}

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

module.exports = getMovies;