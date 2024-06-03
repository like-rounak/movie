import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import MovieList from './MovieList';

const db = getFirestore();

const ListView = () => {
  const { listId } = useParams();
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const listRef = doc(db, 'movieLists', listId);
        const listSnapshot = await getDoc(listRef);

        if (listSnapshot.exists() && listSnapshot.data().visibility === 'public') {
          setList({ id: listSnapshot.id, ...listSnapshot.data() });
        } else {
          setError('This list is private or does not exist.');
        }
      } catch (err) {
        setError('An error occurred while fetching the list.');
      }
    };

    fetchList();
  }, [listId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!list) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{list.name}</h1>
      <MovieList movies={list.movies} />
    </div>
  );
};

export default ListView;
