import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { UserContext } from './contexts/UserContext';

import { api } from './api';

import logo from './logo.svg';
import './App.css';

import Main from './pages/main';
import Login from './Login';
import Register from './Register';
import Home from './pages/Home';
import Customize from './pages/Customize';
import Profile from './pages/Profile';

import { Header } from './Header';

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

function AppContent() {
  const { setUser } = useContext(UserContext); 

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      api.get('/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error("failed to fetch user data", error.response?.data?.msg);
        sessionStorage.removeItem('token');
      });
    }
  }, []);

  return (
    <Router>
      <div className="App">
        {/* <nav>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>*/}
        <Header />
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
