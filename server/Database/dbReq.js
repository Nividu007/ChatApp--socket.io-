const db = require('./db');

async function checkUserExists(name) {
    const [rows, fields] = await db.execute('SELECT * FROM users WHERE username = ?', [name]);
    return rows.length > 0;
}

async function signupUser(name, password) {
    const [result, fields] = await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [name, password]);
    
    const userId = result.insertId;
    const [userRows, userFields] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return userRows[0];
}

async function loginUser(name, password) {
  const [rows, fields] = await db.execute('SELECT * FROM users WHERE username = ? AND password = ?', [name, password]);
  return rows.length > 0 ? rows[0].id : null;
}

async function checkRoom(room) {
    const [rows, fields] = await db.execute('SELECT * FROM chatroom WHERE roomname = ?', [room]);
    let roomExist = rows.length > 0
    if (roomExist > 0) {
      return {roomId: rows[0].roomid, roomExist};
    } else {
      return {roomExist};
    }  
}

async function loadMessages(roomId) {
  try {
    const [messageRows, messageFields] = await db.execute('SELECT * FROM roommessages WHERE roomid = ?', [roomId]);
    
    const messages = await Promise.all(messageRows.map(async (messageRow) => {
      const [userRows, userFields] = await db.execute('SELECT * FROM users WHERE id = ?', [messageRow.userid]);
      return {
        user: userRows[0].username.toUpperCase(),
        text: messageRow.message,
        roomid: roomId,
        userid: messageRow.userid,  
      };
    }));

    return messages;
  } catch (error) {
    console.error('Error loading messages:', error);
    throw error; 
  }
}

async function createRoom(room) {
  const [result, fields] = await db.execute('INSERT INTO chatroom (roomname) VALUES (?)', [room]);
  
  const roomId = result.insertId;
  const [roomRows, userFields] = await db.execute('SELECT * FROM chatroom WHERE roomid = ?', [roomId]);
  
  const createdRoom = {
      roomId: roomId,
      roomDetails: roomRows[0]
  };
  
  return createdRoom;
}

async function updateContent(userId, roomId, text) {
  try {
    const [result, fields] = await db.execute('INSERT INTO roommessages (roomid, userid, message) VALUES (?, ?, ?)', [roomId, userId, text]);
    return { success: true };
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
}

  module.exports = {
    checkUserExists,
    signupUser,
    loginUser,
    checkRoom,
    loadMessages,
    createRoom,
    updateContent,
  };