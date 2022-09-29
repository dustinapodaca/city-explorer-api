'use strict';

const axios = require('axios');

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