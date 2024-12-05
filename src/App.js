import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { UserContext } from './contexts/UserContext';
import { DocsContext } from './contexts/DocContext';
import { DocsProvider } from './contexts/DocContext';
import { RoomContext, RoomProvider } from './contexts/RoomContext';

import { HTML5Backend } from 'react-dnd-html5-backend';

import { DndProvider, useDrag, useDrop } from 'react-dnd';

import { useUserQuery } from './hooks/useUserQuery'; 

import { api } from './api';

import logo from './logo.svg';
import './App.css';

import Main from './pages/main';
import Login from './Login';
import Register from './Register';
import Home from './pages/Home';
import Customize from './pages/Customize';
import Profile from './pages/Profile';
import Library from './pages/Library';
import Docview from './pages/Docview';
import Mailbox from './pages/Mailbox';
import Calendar from './pages/Calendar';

import { Header } from './Header';

function App() {
  const { data: user, isLoading, error } = useUserQuery();

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error loading user data</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <UserProvider>
        <RoomProvider> 
          <DocsProvider>
            <AppContent />
          </DocsProvider>
        </RoomProvider>
      </UserProvider>
    </DndProvider>
  );
}

function AppContent() {
  const { setUser } = useContext(UserContext); 
  const { setRoom } = useContext(RoomContext);


  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      api.get('/auth/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error("failed to fetch user data", error.response?.data?.msg);
        sessionStorage.removeItem('token');
      });

      api.get('/room/getRoomData', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setRoom(response.data);
      })
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
          <Route path="/library" element={<Library />} />
          {/* <Route path="/docview" element={<Docview />} /> */}
          <Route path="/docview/:docId" element={<Docview />} />
          <Route path="/mailbox" element={<Mailbox />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
