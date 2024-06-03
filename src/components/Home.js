import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import SearchList from './SearchList';
import SearchBar from './SearchBar';
import SelectedList from './SelectedList';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
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
  const [selectedListVisibility, setSelectedListVisibility] = useState(null);
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [selectedAddToListId, setSelectedAddToListId] = useState(null);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchLists = async () => {
        const listsSnapshot = await getDocs(collection(db, 'movieLists'));
        const listsData = listsSnapshot.docs
          .filter(doc => doc.data().userId === user.uid)
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setLists(listsData);
      };

      fetchLists();
    }
  }, [user]);

  useEffect(() => {
    if (selectedListId) {
      const fetchListDetails = async () => {
        const listRef = doc(db, 'movieLists', selectedListId);
        const listSnapshot = await getDoc(listRef);
        setSelectedListMovies(listSnapshot.data().movies);
        setSelectedListVisibility(listSnapshot.data().visibility);
      };

      fetchListDetails();
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

  const removeMovieFromList = async (movie) => {
    if (!selectedListId) {
      alert('No list selected.');
      return;
    }
    const listRef = doc(db, 'movieLists', selectedListId);
    await updateDoc(listRef, {
      movies: arrayRemove(movie),
    });
    setSelectedListMovies(selectedListMovies.filter(m => m.imdbID !== movie.imdbID));
  };

  const handleAddToListClick = (movie) => {
    if (!user) {
      setShowSignInPopup(true);
    } else {
      addMovieToList(movie);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onListSelect={setSelectedListId} />
      <div style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ color: '#007BFF' }}>Movie Search</h1>
        <SearchBar search={search} setSearch={setSearch} searchMovies={searchMovies} />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Error: {error}</p>
        ) : (
          <SearchList
            movies={movies}
            selectedListMovies={selectedListMovies}
            lists={lists}
            selectedAddToListId={selectedAddToListId}
            setSelectedAddToListId={setSelectedAddToListId}
            handleAddToListClick={handleAddToListClick}
            handleMovieClick={handleMovieClick}
          />
        )}
        {selectedListId && (
          <SelectedList
            movies={selectedListMovies}
            listId={selectedListId}
            visibility={selectedListVisibility}
            onRemoveMovie={removeMovieFromList}
          />
        )}
        {showSignInPopup && (
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '5px', zIndex: 1000 }}>
            <p>Please sign in to access this feature.</p>
            <button onClick={() => navigate('/signin')}>Sign In</button>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
            <button onClick={() => setShowSignInPopup(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
