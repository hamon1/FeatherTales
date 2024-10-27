import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';

import Login from './Login';
import Register from './Register';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     {/* <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a> */}
    //   </header>
    // </div>
    <Router>
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Edit <code>src/App.js</code> and save to reload.</p> */}

          <nav>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        {/* </header> */}

        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
