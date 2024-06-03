import React from 'react';

const SearchBar = ({ search, setSearch, searchMovies }) => {
  return (
    <form onSubmit={searchMovies}>
      <input
        type='text'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ margin: '10px 0' }}
      />
      <button
        type='submit'
        style={{
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
        }}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
