const GAME_DRAW = 'draw';
const GUEST_WIN = 'guest';
const OWNER_WIN = 'owner';

const startRound = (io, games, gameId) => {
    setTimeout(async () => {
        console.log('start round');
        const game = await games.get(gameId);
        game.round = game.round ? game.round + 1 : 1;
        const roundInfo = {
            gameId: game.id,
            round: game.round
        }
        game.rounds[game.round] = {
            finished: false
        };
        await games.set(gameId, game);
        io.to(game.guest.socketId)
            .emit('roundStarted', roundInfo);
        io.to(game.owner.socketId)
            .emit('roundStarted', roundInfo);
    }, 500);
}

const nextRound = (io, games, gameId) => {
    console.log('next round')
    startRound(io, games, gameId);
};

const endRound = async (io, games, gameId, round) => {
    console.log('endRound');
    const game = await games.get(gameId);
    let guestHand = game.rounds[round].guestHand;
    if (!guestHand) {
        guestHand = randomHand(random);
    }
    let ownerHand = game.rounds[round].ownerHand;
    if (!ownerHand) {
        ownerHand = randomHand(random);
    }

    game.rounds[round].finished = true;
    const winner = getWinner(guestHand, ownerHand);
    let whoWins = GAME_DRAW;
    if (winner === 0) {
        game.rounds[round].winner = GAME_DRAW;
    } else if (winner < 0) {
        game.guest.wins = game.guest.wins + 1;
        game.rounds[round].winner = GUEST_WIN;
        whoWins = game.guest.id;
    } else {
        game.owner.wins = game.owner.wins + 1;
        game.rounds[round].winner = OWNER_WIN;
        whoWins = game.owner.id;
    }
    io.to(game.owner.socketId)
        .emit('roundFinished', {
            gameId: game.id,
            round: round,
            winner: whoWins,
            ownHand: ownerHand,
            otherHand: guestHand
        });
    io.to(game.guest.socketId)
        .emit('roundFinished', {
            gameId: game.id,
            round: round,
            winner: whoWins,
            ownHand: guestHand,
            otherHand: ownerHand
        });
    await games.set(gameId, game);
    if (game.owner.wins < game.numberOfWins && game.guest.wins < game.numberOfWins) {
        nextRound(io, games, gameId);
    }
    else {
        io.to(game.owner.socketId)
            .emit('gameFinished', {
                gameId: game.id,
                winner: game.owner.wins === game.numberOfWins ? game.owner.id : game.guest.id
            });
        io.to(game.guest.socketId)
            .emit('gameFinished', {
                gameId: game.id,
                winner: game.owner.wins === game.numberOfWins ? game.owner.id : game.guest.id
            });
    }
}

const getWinner = (ownerHand, guestHand) => {
    switch (ownerHand) {
        case 'rock':
            switch (guestHand) {
                case 'rock':
                    return 0;
                case 'paper':
                    return 1;
                case 'scissors':
                    return -1;
            }
        case 'paper':
            switch (guestHand) {
                case 'rock':
                    return -1;
                case 'paper':
                    return 0;
                case 'scissors':
                    return 1;
            }
        case 'scissors':
            switch (guestHand) {
                case 'rock':
                    return 1;
                case 'paper':
                    return -1;
                case 'scissors':
                    return 0;
            }
    }
}

const random = () => Math.floor(Math.random() * 3) + 1;

const randomHand = (random) => ['rock', 'paper', 'scissors'][random()];

module.exports = {startRound, endRound, nextRound};
