import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './chat.css';

import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import SideBar from "../SideBar/SideBar";

const ENDPOINT = 'https://chatapp-rdmt.onrender.com';

let socket;

const Chat = ({back, userId}) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { name, room, roomId } = queryString.parse(location.search);
    console.log(name, room, roomId);
    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);
    setRoomId(roomId)

    socket.emit('join', { name, room, roomId, userId }, (error) => {
      if(error) {
        console.log(error);
      }
    });

    if (roomId !== '') {
      try {
        axios.post(`https://chatapp-rdmt.onrender.com/auth/load`, { roomId })
          .then((response) => {
            const result = response.data;
            console.log(result.message);
            setMessages(result.prevMsgs);
            
          })
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("RoomId is not recogonised");
    }

    socket.on('reload', error => {
      alert(error);
      navigate('/');
    })

  }, [ENDPOINT, location]);

   useEffect(() => {
    socket.on( 'message', message => {
      setMessages( messages => [ ...messages, message ]);
      console.log(...messages);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  
  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, roomId, userId, async () => {
        const msg = {
          user: name,
          userId,
          roomId, 
          text: message
        };
          try {
            await axios.post(`https://chatapp-rdmt.onrender.com/auth/contentUpdate`, msg)
          } catch (error) {
            console.log(error)
          }
          setMessage('')
      });
    }
  };
  console.log(messages);
  
  const handleDisconnect = () => {
    socket.disconnect();
  };  

  return (
    <div className="mainContainer">
      <div className="container">
        <InfoBar room={room} back={back} onDisconnect={handleDisconnect} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>    
        <SideBar users={users}/>
    </div>
  );
};

export default Chat;