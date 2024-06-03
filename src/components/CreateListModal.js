import React, { useState } from 'react';

const CreateListModal = ({ onCreate, onClose }) => {
  const [listName, setListName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(listName);
  };

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2>Create New List</h2>
      <form onSubmit={handleSubmit}>
        <input type='text' value={listName} onChange={(e) => setListName(e.target.value)} required placeholder='List Name' />
        <button type='submit'>Create</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CreateListModal;
