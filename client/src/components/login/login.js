import React, {useState , useEffect} from 'react';
import { Link , useNavigate } from 'react-router-dom';
import axios from 'axios';

import './login.css';

const Login = ({ userIdCallback, userNameCallback, SignedIn }) => {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setTimeout(function(){
      setMsg("");
    }, 5000);
  }, [msg]);

  const handleInputChange = (e, type) => {
    switch(type){
      case "name":
        setError("");
        setName(e.target.value);
        if(e.target.value === ""){
          setError("Please enter a username");
        }
        break;
      case "password":
        setError("");
        setPassword(e.target.value);
        if(e.target.value === ""){
          setError("Please enter a password");
        }
        break;
      default:
    }
  }
  function loginSubmit() {
    if (name !== "" && password !== "") {
      try {
        axios.post(`http://localhost:5000/auth/login`, { name, password })
          .then((response) => {
            if (response && response.data) {
              const result = response.data;
  
              if (result.message === "Login successful...") {
                setTimeout(function () {
                  nav("/join");
                }, 2000);
                setMsg(result.message);
                userNameCallback(name);
                userIdCallback(result.user);
                SignedIn(true);
              }
            } else {
              console.error("Invalid response format:", response);
              setError("An error occurred. Invalid response format.");
            }
          })
          .catch((error) => {
            setError(error.response.data.error || "An error occurred");
            console.error(error.response.data.error);
          });
      } catch (error) {
        setError("An unexpected error occurred");
        console.error(error);
      }
    } else {
      setError("All fields are required!");
    }
  }  
  
  return (
    <div className="loginOuterContainer">
      <div className="loginInnerContainer">
        <h1 className="heading">Login</h1>
          <p>
          {
            msg !== "" ?
            <span className="success">{msg}</span>:
            <span className="error">{error}</span>
          }
          </p>
          <div>
            <input placeholder="Username" className="loginInput" type="text" onChange={(e) => handleInputChange(e, "name")} />
          </div>
          <div>
            <input placeholder="Password" className="loginInput mt-20" type="password" onChange={(e) => handleInputChange(e, "password")} />
          </div>
          <Link
            onClick={loginSubmit}>
              <button className={'button mt-20'} type="submit">
              Log In
            </button>
          </Link>
          <a className="signup" href='/SignUp'>Not Registered?</a>      
      </div>
    </div>
  )
  
}

export default Login;
