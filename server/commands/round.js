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
        // the round will end in 5 seconds if any user hasn't yet answered'
        setTimeout(() => endRound(io, game, game.round), 5000);
    }, 500);
}

const nextRound = (io, game) => {
    setTimeout(()=>{
        console.log('next round')
        startRound(io, game);
    }, 750);
};

const endRound = (io, game, round) => {
    if (game.rounds[round].finished) {
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

    game.round = game.round + 1;
    game.rounds[round].finished = true;
    const winner = getWinner(guestHand, ownerHand);
    let whoWins = GAME_DRAW;
    if (winner === 0) {
        game.rounds[round].winner = GAME_DRAW;
    } else if (winner < 0) {
        game.guest.wins = game.guest.wins + 1;
        game.rounds[round].winner = GUEST_WIN;
        whoWins = GUEST_WIN;
    } else {
        game.owner.wins = game.owner.wins + 1;
        game.rounds[round].winner = OWNER_WIN;
        whoWins = OWNER_WIN;
    }
    io.to(game.owner.socketId)
        .emit('roundFinished', {
            gameId: game.id,
            round,
            winner: whoWins
        });
    io.to(game.guest.socketId)
        .emit('roundFinished', {
            gameId: game.id,
            round,
            winner: whoWins
        });
    if (game.rounds.filter((round) => round.winner === GUEST_WIN).length < 1
        || game.rounds.filter((round) => round.winner === OWNER_WIN).length < 1) {
        nextRound(io, game);
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
