const { startRound } = require ('./round');

const joinGame = (io, socket, games) => socket.on('joinGame', function(data) {
    const game = games[data.gameId];
    console.log('==============================');
    console.log('join', game, data);
    console.log('==============================');
    if (!game || game.guest) {
        console.log('Game missing or already with a guest');
        // TODO: if it's the same guest rejoin the play
        io.to(socket.id).emit('gameJoined', {
            gameId: 'gameId',
            status: false
        });
        return;
    }
    game.guest = {
        id: data.fbid,
        socketId: socket.id,
        wins: 0
    };
    const gameJoinedInfo = {
        gameId: data.gameId,
        status: true,
        guestId: data.fbid,
        ownerId: game.owner.id
    };
    io.to(game.guest.socketId).emit('gameJoined', gameJoinedInfo);
    io.to(game.owner.socketId).emit('gameJoined', gameJoinedInfo);
    startRound(io, game);
});
module.exports = joinGame;
