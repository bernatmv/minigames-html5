const { startRound } = require ('./round');

const joinGame = (io, socket, games) => socket.on('joinGame', async function(data) {
    const game = await await games.get(data.gameId);
    console.log('join');
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
    games.set(data.gameId, game);
    io.to(game.guest.socketId).emit('gameJoined', gameJoinedInfo);
    io.to(game.owner.socketId).emit('gameJoined', gameJoinedInfo);
    startRound(io, games, data.gameId);
});
module.exports = joinGame;
