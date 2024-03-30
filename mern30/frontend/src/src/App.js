import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';
import Home from './components/Home.js';
import Register from './components/auth/Register.js';
import Login from './components/auth/Login.js';
import Logout from './components/auth/Logout.js';
import PasswordReset from './components/auth/PasswordReset.js';
import Container from './components/Channels/Container.js';
import './App.css';
import axios from 'axios';
import fetchMessages from './components/auth/fetchmsgs.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [activeItem, setActiveItem] = useState(""); // State to track active menu item
  const [messages, setMessages] = useState([]); // State to store messages

// Function to handle successful login
const handleLogin = () => {
  setIsLoggedIn(true);
};

// Function to handle successful logout
const handleLogout = () => {
  setIsLoggedIn(false);
};




  return (
    <Router>
      <div className="App">
        <div id='title'>
          <span>
            <strong>SLACK4E</strong>
          </span>
          <ul>
            <li className={activeItem === "Home" ? "active" : ""}>
              <Link to="/" onClick={() => setActiveItem("Home")}>Home</Link>
            </li>
            {!isLoggedIn ? (
              <React.Fragment>
                <li className={activeItem === "Register" ? "active" : ""}>
                  <Link to="/register" onClick={() => setActiveItem("Register")}>Sign Up</Link>
                </li>
                <li className={activeItem === "Login" ? "active" : ""}>
                  <Link to="/login" onClick={() => setActiveItem("Login")}>Sign In</Link>
                </li>
              </React.Fragment>
            ) : (
              <>
                <li className={activeItem === "Logout" ? "active" : ""}>
                  <Link to="/logout" onClick={() => setActiveItem("Logout")}>Logout</Link>
                </li>
                <li className={activeItem === "Channels" ? "active" : ""}>
                  <Link to="/ch" onClick={() => setActiveItem("Channels")}>Channels</Link>
                </li>
                <li className={activeItem === "LiveStream" ? "active" : ""}>
                  <Link to="/livestream" onClick={() => setActiveItem("LiveStream")}>Live Stream</Link>
                </li>
                <li className={activeItem === "Students" ? "active" : ""}>
                  <Link to="/students" onClick={() => setActiveItem("Students")}>Students</Link>
                </li>
                <li className={activeItem === "Instructors" ? "active" : ""}>
                  <Link to="/instructors" onClick={() => setActiveItem("Instructors")}>Instructors</Link>
                </li>

                <div>
                  {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                  ))}
                </div>
              </>
            )}
          </ul>
        </div>
      </div>

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/ch" />} />
        <Route
  path="/login"
  element={!isLoggedIn ? <Login handleLogin={handleLogin} fetchMessages={fetchMessages} /> : <Navigate to="/ch" />}/>
        <Route path="/ch" element={isLoggedIn ? <Container /> : <Navigate to="/login" />} />
        <Route path="/forgot-password" element={<PasswordReset />} />
        <Route path="/logout" element={<Logout handleLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
