import React from 'react';

const SearchList = ({
  movies,
  selectedListMovies,
  lists,
  selectedAddToListId,
  setSelectedAddToListId,
  handleAddToListClick,
  handleMovieClick,
}) => {
  const isInList = (movie) => {
    return selectedListMovies.some((m) => m.imdbID === movie.imdbID);
  };

  return (
    <div>
      {movies.map((movie) => (
        <div
          key={movie.imdbID}
          style={{
            borderBottom: '1px solid #ddd',
            padding: '10px 0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={movie.Poster}
            alt={movie.Title}
            style={{ width: '100px', height: '150px', marginRight: '10px' }}
          />
          <div>
            <h2>{movie.Title}</h2>
            <p>
              <strong>Year:</strong> {movie.Year}
            </p>
            <p>
              <strong>Genre:</strong> {movie.Genre}
            </p>
            <p>
              <strong>Actors:</strong> {movie.Actors}
            </p>
            <button onClick={() => handleMovieClick(movie.imdbID)}>
              View Details
            </button>
            <div>
              <button
                onClick={() => handleAddToListClick(movie)}
                disabled={isInList(movie)}
                style={{
                  backgroundColor: isInList(movie) ? 'grey' : '#007BFF',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  marginTop: '10px',
                }}
              >
                {isInList(movie) ? 'Already in List' : 'Add to List'}
              </button>
              <select
                onChange={(e) => setSelectedAddToListId(e.target.value)}
                value={selectedAddToListId}
                style={{ marginLeft: '10px' }}
              >
                <option value=''>Select a list</option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchList;
