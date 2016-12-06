const uuid = require('uuid');

const startGame = (io, socket, games) => socket.on('startGame', function(data) {
    if (!data) {
        io.to(socket.id).emit('error', {
            message: 'no user data on game starts'
        });
    }
    const gameId = uuid.v1();
    const game = {
        id: gameId,
        numberOfWins: data.rounds || 3,
        owner: {
            id: data.fbid,
            socketId: socket.id,
            wins: 0
        },
        rounds: {}
    };
    games[gameId] = game;
    io.to(socket.id).emit('gameStarted', {
        gameId,
        rounds: game.numberOfWins
    });
});
module.exports = startGame;
