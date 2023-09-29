
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {


  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [alertMessage, setAlertMessage] = useState('');
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3001/login', formData)
      .then((response) => {
        console.log(response.data.message);
        // Reset form fields after successful login
        setFormData({
          email: '',
          password: '',
        });
        // Show success alert
        setAlertMessage('Login successful!');
        // Set a timeout to clear the session expiration message
        navigate('dashboard');
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        // Show error alert
        setAlertMessage('Invalid credentials. Please try again.');
      });
  };

  //PreventBackNavigation
  useEffect(() => {
    const preventBackNavigation = (event) => {
      event.preventDefault();
      window.location.replace('/');
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', preventBackNavigation);

    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);


  return (
    <div className='login'>
      <h2>Login</h2>
      {alertMessage && <div className="alert">{alertMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
