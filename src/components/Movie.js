import React from 'react';

const Movie = ({ movie, onMovieClick }) => (
  <div
    key={movie.imdbID}
    style={{ backgroundColor: '#f5f5f5', margin: '10px', padding: '10px', cursor: 'pointer' }}
    onClick={() => {
      console.log(`Movie clicked: ${movie.imdbID}`);
      onMovieClick(movie.imdbID);
    }}
  >
    <h2 style={{ color: '#333' }}>{movie.Title}</h2>
    <img src={movie.Poster} alt={movie.Title} />
  </div>
);

export default Movie;
