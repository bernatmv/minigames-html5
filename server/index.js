const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

server.listen(9000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


io.on('connection', function (socket) {
    socket.on('event', function (data) {
      socket.emit('news', data);
  });
});
