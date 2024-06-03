// Navigation.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';

const Navigation = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/');
    });
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        {user ? (
          <>
            <span>Welcome, {user.email}</span>
            <button onClick={handleSignOut} style={{ marginLeft: '10px' }}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/signin" style={{ marginLeft: '10px' }}>Sign In</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
