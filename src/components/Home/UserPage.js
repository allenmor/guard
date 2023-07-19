import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import './UserPage.css'

function UserPage() {
  const location = useLocation();
  const { email, name } = location.state || {};
  const now = new Date();
  const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()} ${now.getFullYear()}`;
  const timeString = `${now.getHours()}:${now.getMinutes()}`;
  const navigate = useNavigate();

  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);


  useEffect(() => {
    const getUser = async () => {
      const userRef = doc(db, 'users', name);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const { clockIns } = userData;
        if (clockIns && clockIns.length > 0) {
          const { clockInTime, clockOutTime } = clockIns[clockIns.length - 1];
          setClockInTime(clockInTime);
          setClockOutTime(clockOutTime);
        }
      }
    };

    getUser();
  }, [name]);


  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Logout Error:', error);
      });
  };

  const handleClockIn = async () => {
    const now = new Date();
    const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()} ${now.getFullYear()}`;
    const timeString = `${now.getHours()}:${now.getMinutes()}`;
    console.log(formattedDate);
    setClockInTime(timeString);

    const userRef = doc(db, 'users', name);

    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        name: name,
        email: email,
        clockIns: [
          {
            date: formattedDate,
            clockInTime: timeString,
          },
        ],
      });
    } else {
      const userData = docSnap.data();
      let clockInsArray = userData.clockIns || [];
      const existingClockIn = clockInsArray.find((clockIn) => clockIn.date === formattedDate);

      if (!existingClockIn) {
        // Create a new clockIn record if it doesn't exist for the date
        clockInsArray.push({
          date: formattedDate,
          clockInTime: timeString,
        });

        await updateDoc(userRef, {
          clockIns: clockInsArray,
        });
      }
    }
  };

  const handleClockOut = async () => {
    const now = new Date();
    const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()} ${now.getFullYear()}`;
    const timeString = `${now.getHours()}:${now.getMinutes()}`;

    setClockOutTime(timeString);

    const userRef = doc(db, 'users', name);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      let clockInsArray = userData.clockIns || [];
      const existingClockIn = clockInsArray.find((clockIn) => clockIn.date === formattedDate);

      if (existingClockIn) {
        // Update the existing clockIn record with clockOutTime
        existingClockIn.clockOutTime = timeString;

        await updateDoc(userRef, {
          clockIns: clockInsArray,
        });
      }
    }
  };

  return (
    <div className="user-page">
      <h1 className="welcome">Welcome, {name}</h1>
      <p className="date">Current Date: {formattedDate}</p>
      <p className="time">Current Time: {timeString}</p>
      <p className="email">Email: {email}</p>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <button className="clock-in-btn" onClick={handleClockIn}>Clock In</button>
      <button className="clock-out-btn" onClick={handleClockOut}>Clock Out</button>
      <p className="clock-in-time">Clock In Time: {clockInTime}</p>
      <p className="clock-out-time">Clock Out Time: {clockOutTime}</p>
    </div>
  );
}

export default UserPage;
