const joinGame = (io, socket, games) => socket.on('joinGame', function(data) {
    const game = games[data.gameId];
    console.log('join', game, data);
    if (!game || game.guest) {
        socket.emit('gameJoined', {
            gameId: 'gameId',
            status: false
        });
        return;
    }
    game.guest = {
        id: data.fbid,
        socketId: socket.id
    };
    io.to(game.guest.socketId).emit('gameJoined', {
        gameId: data.gameId,
        status: true,
        guestId: data.fbid,
        ownerId: game.owner.id
    });
    io.to(game.owner.socketId).emit('gameJoined', {
        gameId: data.gameId,
        status: true,
        guestId: data.fbid,
        ownerId: game.owner.id
    });
});
module.exports = joinGame;
