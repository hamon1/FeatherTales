import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { DocsProvider } from './contexts/DocContext';
import { RoomProvider } from './contexts/RoomContext';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

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
  return (
    <DndProvider backend={HTML5Backend}>
      <UserProvider>
        <RoomProvider>
          <DocsProvider>
            <Router>
              <AppContent />
            </Router>
          </DocsProvider>
        </RoomProvider>
      </UserProvider>
    </DndProvider>
  );
}

function AppContent() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/library" element={<Library />} />
        <Route path="/docview/:docId" element={<Docview />} />
        <Route path="/mailbox" element={<Mailbox />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </div>
  );
}

export default App;
