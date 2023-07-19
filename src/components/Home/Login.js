import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../../firebase';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate()

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signUpClicked, setSignUpClicked] = useState(false)
  

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        // Login successful
        const user = userCredential.user;
        console.log(user);
        const {email} = user
        navigate('/userpage', { state: { email } });
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
  
  const handleSignUpLoginClick = () => {
    setSignUpClicked(prev => !prev)
  }
  return (
    <div className="login-container">
      { 
      !signUpClicked &&
      <>
        <h2 className="login-header">Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="login-input"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Password"
          />
          <button className="submit-button" type="submit">Login</button>
          <button className="switch-button" onClick={handleSignUpLoginClick}>Sign Up</button>
        </form>
      </>
      }
      {
      signUpClicked &&
      <>
        <h2 className="signup-header">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSignUp}>
          <input
            className="signup-input"
            type="email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="signup-input"
            type="password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            placeholder="Password"
          />
          <button className="submit-button" type="submit">Sign Up</button>
          <button className="switch-button" onClick={handleSignUpLoginClick}>Log In</button>
        </form>
      </>
      }
    </div>
  );
};

export default Login;
