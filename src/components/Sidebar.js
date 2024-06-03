// components/Sidebar.js
import React, { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"; 

const Sidebar = ({ onListSelect }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      if (user) {
        const q = query(collection(db, "movieLists"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedLists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLists(fetchedLists);
      }
    };

    fetchLists();
  }, [user]);

  const createList = async () => {
    const listName = prompt("Enter list name:");
    if (listName) {
      await addDoc(collection(db, "movieLists"), {
        name: listName,
        userId: user.uid,
        public: false, // default to private
      });
      // fetch lists again after adding
      const q = query(collection(db, "movieLists"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedLists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLists(fetchedLists);
    }
  };

  return (
    <div style={{ width: '250px', backgroundColor: '#f4f4f4', padding: '10px' }}>
      <h3>My Lists</h3>
      {user ? (
        <div>
          {lists.map(list => (
            <div key={list.id} onClick={() => onListSelect(list.id)} style={{ cursor: 'pointer' }}>{list.name}</div>
          ))}
          <button onClick={createList}>Create New List</button>
        </div>
      ) : (
        <p>Please log in to create and view lists</p>
      )}
    </div>
  );
};

export default Sidebar;
