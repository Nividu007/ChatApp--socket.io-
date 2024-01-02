import React from 'react';
import { useNavigate } from 'react-router-dom';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ room, back, onDisconnect }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/join');
    back = true;
    onDisconnect(); 
  };

  return (
    <div className="infoBar">
      <div className="leftInnerContainer">
        <img className="onlineIcon" src={onlineIcon} alt="online icon" />
        <h3>{room}</h3>
      </div>
      <div className="rightInnerContainer">
        <button className='closeIcon' onClick={handleClick}>
          <img src={closeIcon} alt="close icon" />
        </button>
      </div>
    </div>
  );
};

export default InfoBar;
