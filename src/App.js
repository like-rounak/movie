// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import './App.css';
import { auth } from './firebaseConfig';

const App = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/');
    });
  };

  return (
    <Router>
      <div className="App">
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
