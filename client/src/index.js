import io from 'socket.io-client';
import * as Rx from 'rx';
import { pipe } from 'lodash/fp';

import createGame from './js/createGame';
import {getSocket, getApi} from './js/serverProxy';
import { startGame } from './js/actions';

const api = pipe(getSocket, getApi);
// CONNECT TO SERVER
const server = api();

window.onload = () => {
    server.eventStream.subscribe(console.log);
    server.connectionStream.subscribe(console.log);
    server.sendCommand({type: 'gameStart'})
    // CREATE GAME CANVAS
    createGame(server);
};
