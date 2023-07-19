import React from 'react';
import Login from './Login';
import './Home.css';

function Home() {
  return (
    <div className="home-div">
      <h1>Security Check In</h1>
      <Login />
    </div>
  );
}

export default Home;
