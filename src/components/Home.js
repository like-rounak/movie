import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import MovieList from './MovieList';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const db = getFirestore();
const auth = getAuth();

const Home = () => {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedListId, setSelectedListId] = useState(null);
  const [selectedListMovies, setSelectedListMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [selectedAddToListId, setSelectedAddToListId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLists = async () => {
      const listsSnapshot = await getDocs(collection(db, 'movieLists'));
      const listsData = listsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLists(listsData);
    };

    fetchLists();
  }, []);

  useEffect(() => {
    if (selectedListId) {
      const fetchListMovies = async () => {
        const listRef = doc(db, 'movieLists', selectedListId);
        const listSnapshot = await getDoc(listRef);
        setSelectedListMovies(listSnapshot.data().movies);
      };

      fetchListMovies();
    }
  }, [selectedListId]);

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
        const detailedMovies = await Promise.all(
          response.data.Search.map(async (movie) => {
            const movieDetailsResponse = await axios.get(`http://www.omdbapi.com/?apikey=47ae321&i=${movie.imdbID}`);
            return movieDetailsResponse.data;
          })
        );
        setMovies(detailedMovies);
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

  const addMovieToList = async (movie) => {
    if (!selectedAddToListId) {
      alert('Please select a list first.');
      return;
    }
    const listRef = doc(db, 'movieLists', selectedAddToListId);
    await updateDoc(listRef, {
      movies: arrayUnion(movie),
    });
  };

  const handleAddToListClick = (movie) => {
    addMovieToList(movie);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onListSelect={setSelectedListId} />
      <div style={{ flex: 1, padding: '20px' }}>
        {user ? (
          <>
            <button onClick={handleSignOut}>Sign Out</button>
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
        {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>Error: {error}</p> : (
          <div>
            {movies.map(movie => (
              <div key={movie.imdbID} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                <h2>{movie.Title}</h2>
                <p><strong>Year:</strong> {movie.Year}</p>
                <p><strong>Genre:</strong> {movie.Genre}</p>
                <p><strong>Actors:</strong> {movie.Actors}</p>
                <button onClick={() => handleMovieClick(movie.imdbID)} style={{ marginRight: '10px' }}>
                  View Details
                </button>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => handleAddToListClick(movie)}
                    disabled={selectedListMovies.some((m) => m.imdbID === movie.imdbID)}
                    style={{ backgroundColor: selectedListMovies.some((m) => m.imdbID === movie.imdbID) ? 'gray' : '#007BFF', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', marginRight: '10px' }}
                  >
                    {selectedListMovies.some((m) => m.imdbID === movie.imdbID) ? 'Already in List' : 'Add to List'}
                  </button>
                  <select onChange={(e) => setSelectedAddToListId(e.target.value)} value={selectedAddToListId || ''}>
                    <option value="" disabled>Select List</option>
                    {lists.map(list => (
                      <option key={list.id} value={list.id}>{list.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedListId && <MovieList movies={selectedListMovies} />}
      </div>
    </div>
  );
};

export default Home;
