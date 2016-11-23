console.log(1);
import io from 'socket.io-client';
console.log(2);
console.log(io);

function play() {
    console.log('play');

    const janken_endpoint = 'http://localhost';

    const socket = io.connect(janken_endpoint);
    socket.on('connect', () => {
        console.log("connected");
        socket.close();
    });
    socket.on('connect_failed', () => {
        console.log("connect_failed");
        socket.close();
    });

    socket.on('message', (data) => console.log(data));

    socket.on('disconnect', () => {
        console.log("disconnected");
        socket.close();
    });
}

window.onload = () => {
    console.log('window.onload');
    play();
};

console.log('EOF');