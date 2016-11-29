export const joinGame = (gameId, name, id) => ({
    type: 'joinGame',
    payload: {
        gameId,
        name,
        fbid: id
    }
});

export const startGame = (name, id) => ({
    type: 'startGame',
    payload: {
        name,
        fbid: id
    }
});

export const play = (gameId, id, hand) => ({
    type: 'play',
    payload: {
        gameId,
        fbid: id,
        hand
    }
});
