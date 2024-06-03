import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieList = ({ movies, listId, visibility }) => {
  const navigate = useNavigate();
  const baseUrl = window.location.origin;

  if (movies.length === 0) {
    return <p>No movies in this list</p>;
  }

  const shareableLink = `${baseUrl}/list/${listId}`;

  return (
    <div>
      <h2>Shareable Link: {visibility === 'public' ? <a href={shareableLink} target='_blank' rel='noopener noreferrer'>{shareableLink}</a> : 'Private'}</h2>
      {movies.map(movie => (
        <div key={movie.imdbID} style={{ borderBottom: '1px solid #ddd', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
          <img src={movie.Poster} alt={movie.Title} style={{ width: '50px', height: '75px', marginRight: '10px' }} />
          <div>
            <h2>{movie.Title}</h2>
            <p><strong>Year:</strong> {movie.Year}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Actors:</strong> {movie.Actors}</p>
            <button onClick={() => navigate(`/movie/${movie.imdbID}`)}>
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
