import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { setDoc, doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

function UserPage() {
  const location = useLocation();
  const { email, name } = location.state || {};
  console.log(name);
  const navigate = useNavigate();

  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const usersCollectionRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);
      console.log(usersSnapshot);
      usersSnapshot.forEach((doc) => {
        // console.log(doc.id, '=>', doc.data());
      });
    };

    getUsers();
  }, []);


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
    <div>
      <h1>Welcome, {name}</h1>
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
