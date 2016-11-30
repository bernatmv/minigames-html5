const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const redis = require('socket.io-redis');
const uuid = require('node-uuid');

const app = express();
const server = app.listen(9000);
const io = socketio.listen(server);
const games = {};

if (process.env.NODE_ENV === 'production') {
    io.adapter(redis({ host: 'redis', port: 6379 }));
}

console.log('listening to port 9000');

app.use(express.static('public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/up', function (req, res) {
  res.json({up:true});
});

io.on('connection', function (socket) {
  console.log('connected');
  let count = 0;

  socket.on('gameStart', function (data) {
     console.log('gameStart');
     const gameId = uuid.v1();
     games[gameId] = {
         rounds: data.rounds || 3,
         owner: {
             id: data.fbid,
             socketId: data.socketId
         },
         rodunds:{}
     };
     console.log(data);
     socket.connected[data.socketId].emit('gameStarted', {gameId});
  });
  socket.on('joinGame', function (data) {
      const game = games[data.gameId];
      if (!game || game.guest) {
        socket.emit('gameJoined', {gameId: 'gameId', status: false});
        return;
      }
      game.guest = {
        id: data.fbid,
        socketId: data.socketId
      };
      socket.connected[data.socketId].emit('gameJoined', {gameId: data.gameId, status:true, guestId: data.fbid, ownerId: game.owner.id })
      socket.connected[game.owner.socketId].emit('gameJoined', {gameId: data.gameId, status:true, guestId: data.fbid, ownerId: game.owner.id })
  });
  socket.on('play', function (data) {
      console.log('play');
      socket.emit('gameFinished', {gameId: 'gameStarted', round:1, win: true})
  });
});
