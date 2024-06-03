// /components/Sidebar.js
import React, { useState, useEffect } from 'react';
import CreateListModal from './CreateListModal';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const db = getFirestore();

const Sidebar = ({ onListSelect }) => {
  const [lists, setLists] = useState([]);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchLists = async () => {
        const listsSnapshot = await getDocs(collection(db, 'movieLists'));
        const userLists = listsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(list => list.userId === user.uid);
        setLists(userLists);
      };

      fetchLists();
    }
  }, [user]);

  const handleCreateList = async (listName, visibility) => {
    await addDoc(collection(db, 'movieLists'), { name: listName, visibility: visibility, movies: [], userId: user.uid });
    setShowCreateListModal(false);
    const listsSnapshot = await getDocs(collection(db, 'movieLists'));
    const userLists = listsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(list => list.userId === user.uid);
    setLists(userLists);
  };

  return (
    <div style={{ width: '250px', borderRight: '1px solid #ddd', padding: '20px' }}>
      <h2>Your Lists</h2>
      <ul>
        {lists.map(list => (
          <li key={list.id} style={{ cursor: 'pointer', padding: '5px 0' }} onClick={() => onListSelect(list.id)}>
            {list.name}
          </li>
        ))}
      </ul>
      <button onClick={() => setShowCreateListModal(true)} style={{ marginTop: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
        Create New List
      </button>
      {showCreateListModal && (
        <CreateListModal
          onCreate={handleCreateList}
          onClose={() => setShowCreateListModal(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
