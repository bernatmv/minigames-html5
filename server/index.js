const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const redis = require('socket.io-redis');

const app = express();
const server = app.listen(9000);
const io = socketio.listen(server);

if (process.env.NODE_ENV === 'production') {
    io.adapter(redis({ host: 'redis', port: 6379 }));
}

console.log('listening to port 9000');

app.use(express.static('public'));

app.get('/api/up', function (req, res) {
  res.json({up:true});
});


io.on('connection', function (socket) {
  console.log('connected');
  let count = 0;

  socket.on('gameStart', function (data) {
     console.log('gameStart');
     socket.emit('gameStarted', {gameId: 'gameStarted'});
  });
  socket.on('joinGame', function (data) {
      console.log('gameJoin');
      socket.emit('roundStarted', {gameId: 'gameStarted', round:1})
  });
  socket.on('play', function (data) {
      console.log('play');
      socket.emit('gameFinished', {gameId: 'gameStarted', round:1, win: true})
  });
});
