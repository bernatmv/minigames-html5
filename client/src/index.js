import io from 'socket.io-client';
import { pipe } from 'lodash/fp';

import createGame from './js/createGame';
import {getSocket, getApi} from './js/serverProxy';
import { startGame } from './js/actions';

require('./css/main.css');

const api = pipe(getSocket, getApi);
// CONNECT TO SERVER
const server = api();

window.onload = () => {
    server.sendCommand({type: 'gameStart'})
    // CREATE GAME CANVAS
    createGame(server);
};
