import io from 'socket.io-client';
import * as Rx from 'rx';
import { Game } from 'phaser';

console.log(PIXI, Phaser, Game);
console.log(Rx);

function connectToServer() {
    const janken_endpoint = 'http://localhost:9000';
    const socket = io.connect(janken_endpoint);
    const source = new Rx.Subject();

    socket.on('connect', () => {
        console.log("connected");
    });

    socket.on('connect_failed', () => {
        console.log("connect_failed");
        socket.close();
    });

    socket.on('event', (data) => source.onNext(data));

    socket.on('disconnect', () => {
        console.log("disconnected");
        socket.close();
        source.return();
    });

    socket.emit('command', {hello: 'world'})

    return source;
}

function createGame() {
    const game = new Phaser.Game(750, 1334, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    function preload() {
    }

    function create() {
        game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
        game.scale.pageAlignVertically = true;
        game.scale.pageAlignHorizontally = true;
    }

    function update() {
    }    
}

window.onload = () => {
    // CONNECT TO SERVER
    const source = connectToServer();
    const observer = Rx.Observer.create(
        (x) => console.log('Next', x),
        (err) => console.log('Error', err),
        () => console.log('Completed')
    );
    const subscription = source.subscribe(observer);

    // CREATE GAME CANVAS
    createGame();
};