export const startGame = (name, id) => ({
    type: 'startGame',
    payload: {
        name,
        fbid: id
    }
});

export const play = (gameId, handSimbol) => ({
    type: 'startGame',
    payload: {
        gameId,
        handSimbol
    }
});
