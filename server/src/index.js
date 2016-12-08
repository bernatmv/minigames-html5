require('babel-polyfill');

const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const ioredis = require('socket.io-redis');
const {startGame, joinGame, play} = require('./commands');

const app = express();
const server = app.listen(9999);
const io = socketio.listen(server);
const games = {};

if (process.env.NODE_ENV === 'production') {
    const compression = require('compression');
    const redisConnection = {
        host: 'redis',
        port: 6379
    };

    app.use(compression());
    io.adapter(ioredis(redisConnection));
    const bluebird = require('bluebird');
    const redis = require('redis');
    bluebird.promisifyAll(redis.RedisClient.prototype);
    bluebird.promisifyAll(redis.Multi.prototype);
    const client = redis.createClient(redisConnection);
    games.set = (key, obj) => client.setAsync(key, JSON.stringify(obj));
    games.get = async key => Promise.resolve(JSON.parse(await client.getAsync(key)));

} else {
    games.set = function(key, obj) {
        this[key] = obj;
        return Promise.resolve();
    };
    games.get = function(key) {
        return Promise.resolve(this[key]);
    }
}

console.log('listening to port 9999');

app.use(express.static('public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/up', function(req, res) {
    res.json({up: true});
});

io.on('connection', function(socket) {
    console.log('connected');
    startGame(io, socket, games);
    joinGame(io, socket, games);
    play(io, socket, games);
});
