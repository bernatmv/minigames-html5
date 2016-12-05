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

export const play = (gameId, round, id, isOwner, hand) => ({
    type: 'play',
    payload: {
        gameId,
        round: round,
        fbid: id,
        isOwner: isOwner,
        hand
    }
});
