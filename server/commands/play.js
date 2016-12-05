const { endRound } = require ('./round');

const play = (io, socket, games) => socket.on('play', function(data) {
    const game = games[data.gameId];
    // no gameId
    if (!game) {
        console.log('NO GAME on play!');
        io.to(socket.id)
            .emit('play', {
                gameId: 'gameId',
                status: false
            });
        return;
    }
    // no round
    if (!data.round) {
        console.log('NO ROUND on play!');
        io.to(socket.id)
            .emit('play', {
                gameId: 'gameId',
                status: false
            });
        return;
    }
    // owner already play
    // TODO: allow to change chosen option before time expires
    if (data.fbid === game.owner.id 
        && game.rounds[data.round]
        && game.rounds[data.round].owner 
        && game.rounds[data.round].owner.hand) {
        console.log('Owner already played!');
        io.to(socket.id)
            .emit('play', {
                gameId: 'gameId',
                status: false
            });
        return;
    }
    // guest already play
    // TODO: allow to change chosen option before time expires
    if (data.fbid === game.guest.id 
        && game.rounds[data.round] 
        && game.rounds[data.round].guest 
        && game.rounds[data.round].guest.hand) {
        console.log('Guest already played!');
        io.to(socket.id)
            .emit('play', {
                gameId: 'gameId',
                status: false
            });
        return;
    }

    if (data.fbid === game.guest.id) {
        game.rounds[data.round].guestHand = data.hand;
        io.to(game.owner.socketId)
            .emit('opponentPlay', {gameId: 'gameId'});
    }
    if (data.fbid === game.owner.id) {
        game.rounds[data.round].ownerHand = data.hand;
        io.to(game.guest.socketId)
            .emit('opponentPlay', {gameId: 'gameId'});
    }
    if (game.rounds[data.round].guestHand
        && game.rounds[data.round].ownerHand) {
        endRound(io, game, game.rounds[data.round]);
    }

});
module.exports = play;
