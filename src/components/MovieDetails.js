import React from 'react';

const MovieDetails = ({ movie, onAddMovieClick, onRemoveMovieClick }) => (
  <div style={{ marginTop: '20px' }}>
    <h2>{movie.Title}</h2>
    <img src={movie.Poster} alt={movie.Title} />
    <p>{movie.Plot}</p>
    <button onClick={() => onAddMovieClick(movie)}>Add to List</button>
    <button onClick={() => onRemoveMovieClick(movie)}>Remove from List</button>
  </div>
);

export default MovieDetails;
