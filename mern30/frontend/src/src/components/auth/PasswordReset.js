  // PasswordReset.js
  import React, { useState } from 'react';
  import '../styles/styles.css'; // Import the CSS file
  import axios from'axios';

  function PasswordReset() {
    const [formData, setFormData] = useState({
      email: ''
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
      e.preventDefault(); 
      // Add your POST request logic here
      axios.post('http://localhost:3001/reset', { msg : formData})
      .then (response =>{
        console.log(response.data); // Just for demonstration
        setFormData({
          username: '',
          email: '',
          password: ''
        });    })
      .catch(error => {
        console.error('Error sending Login Message:', error);
    });
    };

    return (
      <div className='parent'>

      <div className="container">
        <h2>Password Reset</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} />
          <button type="submit">Reset Password</button>
        </form>
      </div>
      </div>
    );
  }

  export default PasswordReset;
