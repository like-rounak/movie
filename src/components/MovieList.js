import React from 'react';
import Movie from './Movie';

const MovieList = ({ movies, onMovieClick }) => (
  <div>
    {movies.map(movie => (
      <Movie key={movie.imdbID} movie={movie} onMovieClick={onMovieClick} />
    ))}
  </div>
);

export default MovieList;
