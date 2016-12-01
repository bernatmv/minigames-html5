const play = (io, socket, games) => socket.on('play', function(data) {
    console.log('play');
    socket.emit('gameFinished', {
        gameId: 'gameStarted',
        round: 1,
        win: true
    })
});
module.exports = play;
