// components/MovieDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getFirestore, doc, getDocs, collection, updateDoc, arrayUnion } from 'firebase/firestore';

const db = getFirestore();

const MovieDetailsPage = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=47ae321&i=${imdbID}`);
        setMovie(response.data);
      } catch (err) {
        setError('An error occurred while fetching movie details.');
      }
      setLoading(false);
    };

    fetchMovieDetails();
  }, [imdbID]);

  useEffect(() => {
    const fetchLists = async () => {
      const listsSnapshot = await getDocs(collection(db, 'movieLists'));
      const listsData = listsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLists(listsData);
    };

    fetchLists();
  }, []);

  const addMovieToList = async (movie, listId) => {
    const listRef = doc(db, 'movieLists', listId);
    await updateDoc(listRef, {
      movies: arrayUnion(movie),
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {movie && (
        <>
          <h1>{movie.Title}</h1>
          <img src={movie.Poster} alt={movie.Title} />
          <p>{movie.Plot}</p>
          <p><strong>Actors:</strong> {movie.Actors}</p>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Released:</strong> {movie.Released}</p>
          <p><strong>Runtime:</strong> {movie.Runtime}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Writer:</strong> {movie.Writer}</p>
          <p><strong>Production:</strong> {movie.Production}</p>
          <p><strong>BoxOffice:</strong> {movie.BoxOffice}</p>
          <p><strong>Awards:</strong> {movie.Awards}</p>
          <p><strong>Country:</strong> {movie.Country}</p>
          <p><strong>Language:</strong> {movie.Language}</p>
          <p><strong>Metascore:</strong> {movie.Metascore}</p>
          <p><strong>imdbRating:</strong> {movie.imdbRating}</p>
          <p><strong>imdbVotes:</strong> {movie.imdbVotes}</p>
          <p><strong>Year:</strong> {movie.Year}</p>
          <p><strong>Type:</strong> {movie.Type}</p>
          <p><strong>DVD Release Date:</strong> {movie.DVD}</p>
          <p><strong>Website:</strong> {movie.Website}</p>
          <select onChange={(e) => addMovieToList(movie, e.target.value)}>
            <option value="">Select List</option>
            {lists.map(list => (
              <option key={list.id} value={list.id}>{list.name}</option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default MovieDetailsPage;
