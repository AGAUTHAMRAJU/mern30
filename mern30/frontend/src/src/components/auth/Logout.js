import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ handleLogout }) {
  const navigate = useNavigate();
  const confirmationShown = useRef(false);

  React.useEffect(() => {
    if (!confirmationShown.current) {
      confirmationShown.current = true;
      if (window.confirm('Are you sure you want to log out?')) {
        handleLogout();
        navigate('/');
      }
    }
  }, [handleLogout, navigate]);
  

  return null;
}

export default Logout;
