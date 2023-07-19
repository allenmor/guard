import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase'; // make sure to import your firestore database
import { setDoc, doc } from '@firebase/firestore';

function UserPage() {
  const location = useLocation();
  const { email, name } = location.state || {}; // also get the name from location state
  const navigate = useNavigate();
  
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);

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

  const handleClockIn = async () => {
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes()}`;
  
    setClockInTime(timeString);  // Set the clock in time
  
    const userRef = doc(db, 'users', email); // Assuming 'users' is your collection name and 'email' is unique identifier
  
    await setDoc(userRef, {
      clockIn: timeString,
      location: "new york", // this should be dynamic based on user's location
      name: name,
    }, { merge: true });
  };
  
  
  const handleClockOut = async () => {
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes()}`;
  
    setClockOutTime(timeString);  // Set the clock out time
  
    const userRef = doc(db, 'users', email); // Assuming 'users' is your collection name and 'email' is unique identifier
  
    await setDoc(userRef, {
      clockOut: timeString,
    }, { merge: true });
  };
  
  return (
    <div>
      <h1>Welcome, {name}</h1> {/* display the user's name */}
      <p>{email}</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleClockIn}>Clock In</button>
      <button onClick={handleClockOut}>Clock Out</button>
      <p>Clock In Time: {clockInTime}</p>
      <p>Clock Out Time: {clockOutTime}</p>
    </div>
  );
}

export default UserPage;
