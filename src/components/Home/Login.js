import React, { useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "../../firebase";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
} from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signUpClicked, setSignUpClicked] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        // Login successful
        const user = userCredential.user;

        // Fetch the latest user profile information
        user.reload().then(() => {
          // console.log(user);

          const { email, displayName } = user;
          navigate("/userpage", { state: { email, name: displayName } });
        });
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

        // Set user's full name
        updateProfile(auth.currentUser, {
          displayName: `${firstName} ${lastName}`,
        }).then(() => {
          // Navigate to the next route with the email as state
          navigate("/userpage", {
            state: { email: user.email, name: `${firstName} ${lastName}` },
          });
        });
      })
      .catch((error) => {
        // Handle sign-up errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };

  const handleSignUpLoginClick = () => {
    setSignUpClicked((prev) => !prev);
  };
  return (
    <div className="login-container">
      {!signUpClicked && (
        <>
          <h2>Login</h2>
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <FormControl
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </FormGroup>
            <FormGroup>
              <FormLabel>Password</FormLabel>
              <FormControl
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
              />
            </FormGroup>
            <Button type="submit" variant="primary">
              Login
            </Button>
            <FormGroup>
              <FormText>
                Don't have an account?
              </FormText>
              <button className="signup-login-alt" variant="secondary" onClick={handleSignUpLoginClick}>
                Sign Up
              </button>
            </FormGroup>
          </Form>
        </>
      )}
      {signUpClicked && (
        <>
          <h2>Sign Up</h2>
          <Form onSubmit={handleSignUp}>
            <FormGroup>
              <FormLabel>First Name</FormLabel>
              <FormControl
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Last Name</FormLabel>
              <FormControl
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <FormControl
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="Email"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Password</FormLabel>
              <FormControl
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Password"
              />
              <Form.Text id="passwordHelpBlock" muted>
                Your password must be minimum 6 characters long.
              </Form.Text>
            </FormGroup>
            <Button type="submit" variant="primary">
              Sign Up
            </Button>
            <FormGroup>
              <FormText>Already have an account?</FormText>
              <button className="signup-login-alt" onClick={handleSignUpLoginClick}>
                Log In
              </button>
            </FormGroup>
          </Form>
        </>
      )}
    </div>
  );
};

export default Login;
