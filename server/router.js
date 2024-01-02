const express = require('express');
const router = express.Router();
const dbReq = require("./Database/dbReq");

const app = express();

router.post('/signup', async (req, res) => {
  const { name, password } = req.body;

  try {
      const userExists = await dbReq.checkUserExists(name);

      if (userExists) {
          return res.status(400).json({ error: 'User already exists with this name.' });
      } 
      else {
        const newUser = await dbReq.signupUser(name, password);
        res.json(newUser);
      }

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
      const user = await dbReq.loginUser(name, password);

      if (!user) {
          return res.status(401).json({ error: 'Invalid Username/Password.' });
      } 
      else {
          res.json({ message: 'Login successful...', user });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/join', async (req, res) => {
  const { room } = req.body;
    
  try {
      const chatRoom = await dbReq.checkRoom(room);
      if (!chatRoom.roomExist) {
        return res.status(401).json({ error: 'Invalid Room Name.' });
      } 
      else {
        res.json({ message: 'Joining to the Room...', roomID: chatRoom.roomId});
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/load', async (req, res) => {
  const { roomId } = req.body;
    
  try {
    const prevMsgs = await dbReq.loadMessages(roomId);
      if (!prevMsgs) {
        return res.status(401).json({ messages: 'No previous Messages' });
      } 
      else {
        res.json({ message: 'Syncing...', prevMsgs});
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create', async (req, res) => {
  const { room } = req.body;

  try {
      const chatRoomExists = await dbReq.checkRoom(room);

      if (chatRoomExists.roomExist) {
          return res.status(401).json({ error: 'Room Already Exists' });
      } 
      else {
          const newRoom = await dbReq.createRoom(room);
          res.json({ message: 'Creating the Room...', roomID: newRoom.roomId });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/contentUpdate', async (req, res) => {
  const messages  = req.body;

  try {
    await dbReq.updateContent(messages.userId, messages.roomId, messages.text);
    console.log(`serverside: ${messages.user}, ${messages.userId}, ${messages.text}, ${messages.roomId}`);
    res.json({ message: 'Messages updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

