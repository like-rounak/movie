import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import MovieList from './MovieList';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const db = getFirestore();
const auth = getAuth();

const Home = () => {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedListId, setSelectedListId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Error signing out: ', err);
    }
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const searchMovies = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=47ae321&s=${search}`);
      if (response.data.Response === 'True') {
        setMovies(response.data.Search);
      } else {
        setError('No movies found');
        setMovies([]);
      }
    } catch (err) {
      setError('An error occurred while searching for movies.');
    }
    setLoading(false);
  };

  const handleMovieClick = (imdbID) => {
    navigate(`/movie/${imdbID}`);
  };

  const addMovieToList = async (movie, isPublic) => {
    if (!selectedListId) {
      alert('Please select a list first.');
      return;
    }
    const listRef = doc(db, 'movieLists', selectedListId);
    await updateDoc(listRef, {
      movies: arrayUnion(movie),
      public: isPublic,
    });
  };

  const removeMovieFromList = async (movie) => {
    if (!selectedListId) {
      alert('Please select a list first.');
      return;
    }
    const listRef = doc(db, 'movieLists', selectedListId);
    await updateDoc(listRef, {
      movies: arrayRemove(movie),
    });
  };

  const handleAddMovieClick = (movie) => {
    const isPublic = window.confirm('Make this list public?');
    addMovieToList(movie, isPublic);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onListSelect={setSelectedListId} />
      <div style={{ flex: 1, padding: '20px' }}>
        {user ? (
          <>
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={handleSignInClick}>Sign In</button>
            <button onClick={handleSignUpClick}>Sign Up</button>
          </>
        ) : (
          <>
            <button onClick={handleSignInClick}>Sign In</button>
            <button onClick={handleSignUpClick}>Sign Up</button>
          </>
        )}
        <h1 style={{ color: '#007BFF' }}>Movie Search</h1>
        <form onSubmit={searchMovies}>
          <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} style={{ margin: '10px 0' }} />
          <button type='submit' style={{ backgroundColor: '#007BFF', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
            Search
          </button>
        </form>
        {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>Error: {error}</p> : <MovieList movies={movies} onMovieClick={handleMovieClick} />}
      </div>
    </div>
  );
};

export default Home;
