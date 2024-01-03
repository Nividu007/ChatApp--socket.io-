import React, {useState} from 'react';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Join.css';

const Join = ({ name }) => {
  const nav = useNavigate();
  const [room, setRoom] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  function handleJoin() {
    if (room !== '') {
      let roomName = encodeURIComponent(room);
      try {
        axios.post(`https://chatapp-rdmt.onrender.com/auth/join`, { room: roomName })
          .then((response) => {
            const result = response.data;
  
            if (result.message === "Joining to the Room...") {
            
              setTimeout(function () {
                nav(`/chat?name=${name}&room=${roomName}&roomId=${result.roomID}`);
              }, 500);
              setMsg(result.message);
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
      setError("Room Name is required!");
    }
  }

  function handleCreate() {
    if (room !== '') {
      let roomName = encodeURIComponent(room);
      try {
        axios.post(`https://chatapp-rdmt.onrender.com/auth/create`, { room: roomName })
        .then((response) => {
            const result = response.data;

            if (result.message === "Creating the Room...") {
                setTimeout(function () {
                    nav(`/chat?name=${name}&room=${roomName}&roomId=${result.roomID}`);
                }, 500);
                setMsg(result.message);
            }
        })
        .catch((result) => {
            setError(result.response.data.error || "An error occurred");
            console.error(result.response.data.error);
        });
      } catch (error) {
        
        setError("An unexpected error occurred");
        console.error(error);
      }
    } else {
      setError("Room Name is required!");
    }
  }

  return (
    <div className="joinOuterContainer">
      <div className="welcome">
        <h1 className='msg'>Welcome, {name}!</h1>
        <p className='textMsg'>{
            msg !== "" ?
            <span className="success">{msg}</span>:
            <span className="error">{error}</span>
          }</p>
      </div>
      <div className="centerColumn">
        <div className="joinInnerContainer">
          <h1 className="headingJ">Join Chat Room</h1>
            <div>
              <input placeholder="Room Name" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
            </div>
              <button className={'button mt-20'} type="submit" onClick={handleJoin}>Join</button>     
        </div>
        <div className="createInnerContainer">
          <h1 className="headingC">Make Chat Room</h1>
          <div>
            <input placeholder="Room Name" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
          </div>
            <button className={'button mt-20'} type="submit" onClick={handleCreate}>Make</button>    
        </div>
      </div>
      <div className="logOutContainer">
        <a className="logout" href='/'>Logout</a> 
      </div>
    </div>
  )
}

export default Join;
