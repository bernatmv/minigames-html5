const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = app.listen(9000);
const io = socketio.listen(server);


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


io.on('connection', function (socket) {
    console.log('connected');
    socket.on('command', function (data) {
    console.log('event', data);
    socket.emit('event', data);
  });
});
