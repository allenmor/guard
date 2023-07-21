import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "react-bootstrap";
import "./UserPage.css";

function UserPage() {
  const [geoLocationSet, setGeoLocationSet] = useState(false);
  const location = useLocation();
  const { email, name } = location.state || {};
  const now = new Date();
  const formattedDate = `${now.toLocaleString("default", {
    month: "short",
  })} ${now.getDate()} ${now.getFullYear()}`;
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/New_York",
  });

  const navigate = useNavigate();
  const [geoLocation, setGeoLocation] = useState({
    latitude: null,
    longitude: null,
    address: null,
    error: null,
  });
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const userRef = doc(db, "users", name);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const { clockIns } = userData;
        if (clockIns && clockIns.length > 0) {
          const { date, clockInTime, clockOutTime } =
            clockIns[clockIns.length - 1];
          const clockInDateTime = new Date(`${date} ${clockInTime}`);
          const clockOutDateTime = new Date(`${date} ${clockOutTime}`);
          const userTimezoneClockInTime = clockInDateTime.toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit", timeZone: "America/New_York" }
          );
          const userTimezoneClockOutTime = clockOutDateTime.toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit", timeZone: "America/New_York" }
          );
          setClockInTime(userTimezoneClockInTime);
          setClockOutTime(userTimezoneClockOutTime);
          console.log(userTimezoneClockInTime);
          console.log(userTimezoneClockOutTime);
        }
      }
    };

    getUser();
  }, [name]);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  const handleClockIn = async () => {
    const now = new Date();
    const formattedDate = `${now.toLocaleString("default", {
      month: "short",
    })} ${now.getDate()} ${now.getFullYear()}`;
    const timeString = `${now.getHours()}:${now.getMinutes()}`;

    console.log(formattedDate);
    setClockInTime(timeString);

    const userRef = doc(db, "users", name);

    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        name: name,
        email: email,
        clockIns: [
          {
            date: formattedDate,
            clockInTime: timeString,
            clockInLocation: geoLocation.address, // Add clockInLocation to clockIn data
          },
        ],
      });
    } else {
      const userData = docSnap.data();
      let clockInsArray = userData.clockIns || [];
      const existingClockIn = clockInsArray.find(
        (clockIn) => clockIn.date === formattedDate
      );

      if (!existingClockIn) {
        // Create a new clockIn record if it doesn't exist for the date
        clockInsArray.push({
          date: formattedDate,
          clockInTime: timeString,
          clockInLocation: geoLocation.address, // Add clockInLocation to clockIn data
        });

        await updateDoc(userRef, {
          clockIns: clockInsArray,
        });
      }
    }
  };

  const handleClockOut = async () => {
    const now = new Date();
    const formattedDate = `${now.toLocaleString("default", {
      month: "short",
    })} ${now.getDate()} ${now.getFullYear()}`;
    const timeString = `${now.getHours()}:${now.getMinutes()}`;

    setClockOutTime(timeString);

    const userRef = doc(db, "users", name);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      let clockInsArray = userData.clockIns || [];
      const existingClockIn = clockInsArray.find(
        (clockIn) => clockIn.date === formattedDate
      );

      if (existingClockIn) {
        // Update the existing clockIn record with clockOutTime
        existingClockIn.clockOutTime = timeString;
        existingClockIn.clockOutLocation = geoLocation.address; // Add clockOutLocation to clockIn data

        await updateDoc(userRef, {
          clockIns: clockInsArray,
        });
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLocation((prevState) => ({
          ...prevState,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));

        // Call Google's Geocoding API
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.REACT_APP_GEO_LOCATION_KEY}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.results && data.results[0]) {
              setGeoLocation((prevState) => ({
                ...prevState,
                address: data.results[0].formatted_address,
              }));
              setGeoLocationSet(true);
            } else {
              throw new Error("No results returned from geocoding API");
            }
          })
          .catch((error) =>
            setGeoLocation((prevState) => ({
              ...prevState,
              error: error.message,
            }))
          );
      },
      (error) =>
        setGeoLocation((prevState) => ({
          ...prevState,
          error: error.message,
        })),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    console.log(geoLocation);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="user-page-container">
      <div className="date-time-logout-div">
        <p>{formattedDate}</p>
        <p>{timeString}</p>
          <Button size="sm" variant="dark" onClick={handleLogout}>Logout</Button>
      </div>
      <h1>{name}</h1>
      <div className="address-div">
        <p className="address-head">Address</p>
        <p className="address-text">{geoLocation.address}</p>
      </div>
      <div className="d-grid gap-2">
        {geoLocationSet && (
          <>
            <Button variant="success" onClick={handleClockIn}>Clock In</Button>
            <Button variant="danger" onClick={handleClockOut}>Clock Out</Button>
          </>
        )}
      </div>
      <div className="clockin-clockout-div">
        <p>Clock In Time: {clockInTime}</p>
        <p>Clock Out Time: {clockOutTime}</p>
      </div>
    </div>
  );
}

export default UserPage;
