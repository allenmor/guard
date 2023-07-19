import React from 'react'
import { useLocation } from 'react-router-dom'

function UserPage() {
    const location = useLocation();
    const { email } = location.state || {};
  
    console.log('Email:', email);
  return (
    <div>
        <p>{email}</p>
        <button>Clock In</button>
        <button>Clock Out</button>
    </div>
  )
}

export default UserPage