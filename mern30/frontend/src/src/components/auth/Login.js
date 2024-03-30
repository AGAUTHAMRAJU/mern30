import React, { useState } from 'react';
import axios from 'axios';
// import fetchMessages from './fetchmsgs';

function Login({ handleLogin, fetchMessages }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/login', formData)
      .then(response => {
        const { success, message, token } = response.data;
        if (success) {
          handleLogin(token); // Pass the token to handleLogin
          fetchMessages(token); // Call fetchMessages after successful login
        } else {
          setError(message);
        }
      })
      .catch(error => {
        console.error('Error sending Login Message:', error);
        setError('An unexpected error occurred, please try again later.');
      });
  };
  

  return (
    <div className='parent'>
      <div className="container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
