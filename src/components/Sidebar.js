import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import CreateListModal from './CreateListModal';

const db = getFirestore();

const Sidebar = ({ onListSelect }) => {
  const [lists, setLists] = useState([]);
  const [showCreateListModal, setShowCreateListModal] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      const listsSnapshot = await getDocs(collection(db, 'movieLists'));
      const listsData = listsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLists(listsData);
    };

    fetchLists();
  }, []);

  const handleListClick = (list) => {
    onListSelect(list.id);
  };

  const handleCreateList = async (listName) => {
    await addDoc(collection(db, 'movieLists'), { name: listName, movies: [] });
    setShowCreateListModal(false);
    // Refresh the lists after creating a new one
    const listsSnapshot = await getDocs(collection(db, 'movieLists'));
    const listsData = listsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLists(listsData);
  };

  return (
    <div style={{ width: '250px', padding: '20px', borderRight: '1px solid #ddd' }}>
      <h2>My Lists</h2>
      <button onClick={() => setShowCreateListModal(true)}>Create List</button>
      <ul>
        {lists.map(list => (
          <li key={list.id} onClick={() => handleListClick(list)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
            {list.name}
          </li>
        ))}
      </ul>
      {showCreateListModal && <CreateListModal onCreate={handleCreateList} onClose={() => setShowCreateListModal(false)} />}
    </div>
  );
};

export default Sidebar;
