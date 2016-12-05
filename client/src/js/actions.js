export const joinGame = (gameId, name, id) => ({
    type: 'joinGame',
    payload: {
        gameId: gameId,
        name: name,
        fbid: id
    }
});

export const startGame = (name, id) => ({
    type: 'startGame',
    payload: {
        name: name,
        fbid: id
    }
});

export const play = (gameId, round, id, hand) => ({
    type: 'play',
    payload: {
        gameId: gameId,
        round: round,
        fbid: id,
        hand: hand
    }
});
