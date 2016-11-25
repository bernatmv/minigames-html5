import io from 'socket.io-client';
import * as Rx from 'rx';
import { Phaser } from 'phaser';

import connectToServer from './js/connectToServer';
import monitorConnection from './js/monitorConnection';
import createGame from './js/createGame';
import gameLogic from './js/gameLogic';

console.log(PIXI, Phaser, Game, Rx);

window.onload = () => {
    // CONNECT TO SERVER
    const source = connectToServer();
    // MONITOR CONNECTION
    monitorConnection(source);
    // START GAME LOGIC
    gameLogic(source);
    // CREATE GAME CANVAS
    createGame();
};