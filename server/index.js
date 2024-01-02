require("dotenv").config();

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./user');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(router);
app.use("/auth", router);

io.on('connection', (socket) => {
  socket.on('join', ({ name, room, roomId, userId }, callback) => {
    roomID = roomId;
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error === 'That user already in the room.') {
      socket.emit('reload', error)
    }
    if (error) return callback(error);

    console.log(`${user.name} Joins`);
    socket.join(user.room);

    socket.emit('message', { user: 'ADMIN', text: `${user.name}, welcome to room "${user.room}".`, roomId: roomID, userId: 0o1 });

    socket.broadcast.to(user.room).emit('message', { user: 'ADMIN', text: `${user.name} has joined!`, roomId: roomID, userId: 0o1});

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, roomId, userId, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message, roomId: roomId, userId: userId });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'ADMIN', text: `${user.name} has left.`, roomId: roomID, userId: 0o1});
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      
      console.log(`${user.name} has left.`);
    }
  });
});

const PORT = process.env.PORT || PORT;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));