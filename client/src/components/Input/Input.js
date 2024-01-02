import React, { useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import './Input.css';

const Input = ({ message, setMessage, sendMessage }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  return (
    <div className='form'>
      <div className="emojiPickerContainer">
        {showEmojiPicker && (
          <div className="emojiPickerOverlay">
            <EmojiPicker width={300} height={400} onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      <button className="emojiButton" onClick={toggleEmojiPicker}>
        🙂
      </button>

      <input
        className='input'
        type='text'
        placeholder='Type...'
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyPress={(event) => (event.key === 'Enter' ? sendMessage(event) : null)}
      />
      
      <button className="sendButton" onClick={(e) => { sendMessage(e); setShowEmojiPicker(false); }}>
        ⇛
      </button>
    </div>
  );
};

export default Input;
