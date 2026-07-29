import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// ─── Context Providers ────────────────────────────────────────────────────────
import { UserProvider } from './contexts/UserContext';
import { DocsProvider } from './contexts/DocContext';
import { RoomProvider } from './contexts/RoomContext';

// ─── 외부 라이브러리 ───────────────────────────────────────────────────────────
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

// ─── 페이지 컴포넌트 ───────────────────────────────────────────────────────────
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

// DndProvider > UserProvider > RoomProvider > DocsProvider 순서로 중첩
// DndProvider가 최상위에 있어야 자식 컴포넌트에서 드래그 앤 드롭 사용 가능
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
