const GAME_DRAW = 'draw';
const GUEST_WIN = 'guest';
const OWNER_WIN = 'owner';

const startRound = (io, game) => {
    setTimeout(() => {
        console.log('start round')
        game.round = game.round ? game.round + 1 : 1;
        const roundInfo = {
            gameId: game.id,
            round: game.round
        }
        game.rounds[game.round] = {
            finished: false
        };
        io.to(game.guest.socketId)
            .emit('roundStarted', roundInfo);
        io.to(game.owner.socketId)
            .emit('roundStarted', roundInfo);
    }, 500);
}

const nextRound = (io, game) => {
    console.log('next round')
    startRound(io, game);
};

const endRound = (io, game, round) => {
    console.log(game);
    console.log(round);
    if (game.rounds[round].finished
        || !game.rounds[round].owner
        || !game.rounds[round].guest) {
        // try to finish a round already finished.
        return;
    }
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
    if (game.rounds.filter((round) => round.winner === GUEST_WIN).length < 1
        || game.rounds.filter((round) => round.winner === OWNER_WIN).length < 1) {
        nextRound(io, game);
    }
    else {
        io.to(game.owner.socketId)
            .emit('gameFinished', {
                gameId: game.id,
                winner: (game.rounds.filter((round) => round.winner === OWNER_WIN).length >= 1) ? game.owner.id : game.guest.id 
            });
        io.to(game.guest.socketId)
            .emit('gameFinished', {
                gameId: game.id,
                winner: (game.rounds.filter((round) => round.winner === OWNER_WIN).length >= 1) ? game.owner.id : game.guest.id 
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
