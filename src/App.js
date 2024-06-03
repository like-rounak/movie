import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './Navigation';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import MovieDetails from './components/MovieDetails';
import ListView from './components/ListView';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/movie/:imdbID" element={<MovieDetails />} />
          <Route path="/list/:listId" element={<ListView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
