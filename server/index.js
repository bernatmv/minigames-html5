const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const redis = require('socket.io-redis');
const { startGame, joinGame, play } = require('./commands');

const app = express();
const server = app.listen(9999);
const io = socketio.listen(server);
const games = {};

if (process.env.NODE_ENV === 'production') {
    io.adapter(redis({
        host: 'redis',
        port: 6379
    }));
    const compression = require('compression');
    app.use(compression());
}

console.log('listening to port 9999');

app.use(express.static('public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/up', function(req, res) {
    res.json({
        up: true
    });
});

io.on('connection', function(socket) {
    console.log('connected');
    startGame(io, socket, games);
    joinGame(io, socket, games);
    play(io, socket,games);
});
