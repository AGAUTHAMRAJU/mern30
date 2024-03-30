// Register.js
import React, { useState } from 'react';
import '../styles/styles.css'; // Import the CSS file
import axios from'axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    // Add your POST request logic here
    axios.post('http://localhost:3001/register', formData)
    .then (response =>{
      console.log(response.data); // Just for demonstration
      setFormData({
        username: '',
        email: '',
        password: ''
      });
    })
    .catch(error => {
      console.error('Error sending Login Message:', error);
  });
  };

  return (
    <div className='parent'>

    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
    </div>
  );
}

export default Register;
