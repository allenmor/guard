import React from "react";
import Login from "./Login";
import "./Home.css";
import 'react-bootstrap'

function Home() {
  return (
    <div className="card">
      <h1 className="card-header custom-card-header">Security Check In</h1>
      <Login />
    </div>
  );
}

export default Home;
