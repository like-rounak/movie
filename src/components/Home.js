// components/Home.js
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { db } from '../firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const Movie = ({ movie, onMovieClick }) => (
  <div key={movie.imdbID} style={{ backgroundColor: '#f5f5f5', margin: '10px', padding: '10px' }} onClick={() => onMovieClick(movie.imdbID)}>
    <h2 style={{ color: '#333' }}>{movie.Title}</h2>
    <img src={movie.Poster} alt={movie.Title} />
  </div>
);

const Home = () => {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedListId, setSelectedListId] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const searchMovies = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=47ae321&s=${search}`);
      if (response.data.Response === "True") {
        setMovies(response.data.Search);
      } else {
        setError("No movies found");
        setMovies([]);
      }
    } catch (err) {
      setError("An error occurred while searching for movies.");
    }
    setLoading(false);
  };

  const handleMovieClick = async (imdbID) => {
    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=47ae321&i=${imdbID}`);
      setSelectedMovie(response.data);
    } catch (err) {
      setError("An error occurred while fetching movie details.");
    }
  };

  const addMovieToList = async (movie) => {
    if (!selectedListId) {
      alert("Please select a list first.");
      return;
    }
    const listRef = doc(db, "movieLists", selectedListId);
    await updateDoc(listRef, {
      movies: arrayUnion(movie)
    });
  };

  const removeMovieFromList = async (movie) => {
    if (!selectedListId) {
      alert("Please select a list first.");
      return;
    }
    const listRef = doc(db, "movieLists", selectedListId);
    await updateDoc(listRef, {
      movies: arrayRemove(movie)
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onListSelect={setSelectedListId} />
      <div style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ color: '#007BFF' }}>Movie Search</h1>
        <form onSubmit={searchMovies}>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} style={{ margin: '10px 0' }} />
          <button type="submit" style={{ backgroundColor: '#007BFF', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>Search</button>
        </form>
        {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>Error: {error}</p> : movies.map(movie => <Movie key={movie.imdbID} movie={movie} onMovieClick={handleMovieClick} />)}
        {selectedMovie && (
          <div style={{ marginTop: '20px' }}>
            <h2>{selectedMovie.Title}</h2>
            <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
            <p>{selectedMovie.Plot}</p>
            <button onClick={() => addMovieToList(selectedMovie)}>Add to List</button>
            <button onClick={() => removeMovieFromList(selectedMovie)}>Remove from List</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
