import io from 'socket.io-client';
import { Game } from 'phaser';
console.log(PIXI, Phaser, Game);

function play() {
    const janken_endpoint = 'http://localhost:9000';
    const socket = io.connect(janken_endpoint);
    socket.on('connect', () => {
        console.log("connected");
    });
    socket.on('connect_failed', () => {
        console.log("connect_failed");
        socket.close();
    });

    socket.on('event', (data) => console.log(data));

    socket.on('disconnect', () => {
        console.log("disconnected");
        socket.close();
    });
    socket.emit('command', {hello: 'world'})
}

window.onload = () => {
    play();
};
