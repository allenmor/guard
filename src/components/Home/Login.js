import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../../firebase';


const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        // Login successful
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        // Handle login errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };
  
  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
        // Sign-up successful
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        // Handle sign-up errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };
  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Login;
