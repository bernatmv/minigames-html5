const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const redis = require('socket.io-redis');

const app = express();
const server = app.listen(9000);
const io = socketio.listen(server);
io.adapter(redis({ host: 'redis', port: 6379 }));
console.log('listening to port 9000');

app.use(express.static('public'));

app.get('/api/up', function (req, res) {
  res.json({up:true});
});


io.on('connection', function (socket) {
  console.log('connected');
  let count = 0;

  socket.on('command', function (data) {
    console.log('event', data);
    socket.emit('event', { data: data, iteration: count });

    const interval = setInterval(function() {
      if (count > 100) {
        clearInterval(interval);
      }
      count++;
      console.log('interval event', data);
      socket.emit('event', { data: data, iteration: count });
    }, 1000);
  });
});
