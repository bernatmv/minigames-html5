const { endRound } = require ('./round');

const play = (io, socket, games) => socket.on('play', function(data) {
    const game = games[data.gameId];
    // no gameId
    if (!game) {
        io.to(socket.id)
            .emit('play', {
                gameId: 'gameId',
                status: false
            });
        return;
    }
    // no round
    if (!data.round) {
        io.to(socket.id)
            .emit('play', {
                gameId: 'gameId',
                status: false
            });
        return;
    }
    // owner already play
    if (data.ownerId && game.rounds[data.round] && game.rounds[data.round].ownerId) {
        io.to(socket.id)
            .emit('play', {
                gameId: 'gameId',
                status: false
            });
        return;
    }
    // guest already play
    if (data.guestId && game.rounds[data.round] && game.rounds[data.round].guestId) {
        io.to(socket.id)
            .emit('play', {
                gameId: 'gameId',
                status: false
            });
        return;
    }
    if (data.guestId) {
        game.rounds[data.round].guestHand = data.hand;
    }
    if (data.ownerId) {
        game.rounds[data.round].guestHand = data.hand;
    }
    if (game.rounds[data.round].guestId && game.rounds[data.round].ownerId) {
        endRound(io, game, game.rounds[data.round]);
    }

});
module.exports = play;
