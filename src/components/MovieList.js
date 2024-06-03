// components/MovieList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieList = ({ movies, listId, visibility, onRemoveMovie }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Shareable Link: {visibility === 'public' ? <a href={`/list/${listId}`} target='_blank' rel='noopener noreferrer'>{`/list/${listId}`}</a> : 'Private'}</h2>
      {movies.map(movie => (
        <div key={movie.imdbID} style={{ borderBottom: '1px solid #ddd', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
          <img src={movie.Poster} />
          <div>
            <h2>{movie.Title}</h2>
            <p><strong>Year:</strong> {movie.Year}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Actors:</strong> {movie.Actors}</p>
            <button onClick={() => navigate(`/movie/${movie.imdbID}`)}>View Details</button>
            <button onClick={() => onRemoveMovie(movie)}>Remove from List</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;

