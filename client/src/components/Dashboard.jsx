


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(60); // Start with 60 seconds (1 minute)

  // Ref for the inactivity countdown timer
  const inactivityTimerRef = useRef(null);

  // Function to logout and redirect to login page after two minutes of inactivity
  const logoutAfterInactivity = () => {
    axios.post('http://localhost:3001/logout').then((response) => {
      console.log(response.data.message);
      navigate('/');
    });
  };

  // Function to reset the inactivity countdown timer
  const resetInactivityTimer = () => {
    clearInterval(inactivityTimerRef.current);
    inactivityTimerRef.current = setInterval(logoutAfterInactivity, 30000); // 30 seconds (30,000 milliseconds)
  };

  // Countdown effect for the one-minute automatic logout
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // Clear the interval when the component unmounts or secondsLeft reaches 0
    return () => {
      clearInterval(interval);
      clearInterval(inactivityTimerRef.current);
    };
  }, []);

  // Reset the countdown on user activity (e.g., mouse movement, keyboard input)
  useEffect(() => {
    resetInactivityTimer();

    // Add event listeners for user activity
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);

    // Clean up event listeners when the component unmounts
    return () => {
      document.removeEventListener('mousemove', resetInactivityTimer);
      document.removeEventListener('keydown', resetInactivityTimer);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload(); // Refresh the dashboard page
  };

  return (
    <div>
      <h2>Welcome to the Dashboard!</h2>
      <button onClick={handleRefresh}>Refresh Dashboard</button>
      <p>Session will expire in {secondsLeft} seconds</p>
    </div>
  );
};

export default Dashboard;


