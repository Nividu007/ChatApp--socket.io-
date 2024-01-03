import React, { useState } from 'react';
import axios from 'axios';

import './SignUp.css';

function SignUp() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (name.length === 0) {
      setError("Name Field is Empty");
    } else if (password.length === 0) {
      setError("Password Field is Empty");
    } else {
      try {
        
        await axios.post(`https://chatapp-rdmt.onrender.com/auth/signup`, { name, password });

        setTimeout(function () {
          window.location.href = "/";
        },2000);

        setMsg("Successfully Registered! Redirecting...");

      } catch (error) {
        setError(error.response.data.error);
      }
    }
  }

  return (
    <div className="signUpOuterContainer">
      <div className="signUpInnerContainer">
        <h1 className="heading">SignUp</h1>
        <p>
          {
            msg !== "" ? 
            <span className="success">{msg}</span>:
            <span className="error">{error}</span>
             
          }
          </p>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              placeholder="Name"
              className="signUpInput"
              type="text"
              onChange={(event) => setName(event.target.value)}
              name='username'
            />
          </div>
          <div>
            <input
              placeholder="Password"
              className="signUpInput mt-20"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              name='password'
            />
          </div>
          <button className="button mt-20" type="submit">
            Sign Up
          </button>
        </form>
        <a className="login" href="/">
          Already Sign up?
        </a>
      </div>
    </div>
  );
}

export default SignUp;
