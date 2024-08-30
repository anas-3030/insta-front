import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/allstyle.css";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token'); // Clear token from localStorage
    navigate('/login'); // Redirect to login page
    window.location.reload();
  }, [navigate]);

  return <div>Logging out...</div>; // Optional: display a logout message or spinner
};

export default Logout;
