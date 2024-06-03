import React, { useState } from 'react';

const CreateListModal = ({ onCreate, onClose }) => {
  const [listName, setListName] = useState('');
  const [visibility, setVisibility] = useState('private');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(listName, visibility);
  };

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
      <h2>Create New List</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder='List Name'
          style={{ margin: '10px 0' }}
          required
        />
        <div>
          <label>
            <input
              type='radio'
              value='private'
              checked={visibility === 'private'}
              onChange={(e) => setVisibility(e.target.value)}
            />
            Private
          </label>
          <label style={{ marginLeft: '10px' }}>
            <input
              type='radio'
              value='public'
              checked={visibility === 'public'}
              onChange={(e) => setVisibility(e.target.value)}
            />
            Public
          </label>
        </div>
        <button type='submit' style={{ backgroundColor: '#007BFF', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
          Create
        </button>
        <button type='button' onClick={onClose} style={{ marginLeft: '10px', backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateListModal;
