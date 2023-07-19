import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

function UserPage() {
  const location = useLocation();
  const { email, name } = location.state || {}; // also get the name from location state
  const navigate = useNavigate();

  console.log('Email:', email);
  console.log('Name:', name);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        // Logout successful
        navigate('/'); // Redirect to the login page or any other desired route
      })
      .catch((error) => {
        // Handle logout errors
        console.error('Logout Error:', error);
      });
  };

  return (
    <div>
      <h1>Welcome, {name}</h1> {/* display the user's name */}
      <p>{email}</p>
      <button onClick={handleLogout}>Logout</button>
      <button>Clock In</button>
      <button>Clock Out</button>
    </div>
  );
}

export default UserPage;
