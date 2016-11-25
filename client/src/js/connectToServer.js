import io from 'socket.io-client';
import * as Rx from 'rx';

export default function connectToServer() {
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