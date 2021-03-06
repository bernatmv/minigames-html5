import io from 'socket.io-client';
import { Subject } from 'rx-lite';

export const getSocket = (url = process.env.SERVER) => io.connect(url);

const connectionStream = (socket) =>{
    const source = new Subject();
    socket.on('connect', () => source.onNext({status: 'connected'}));
    socket.on('reconnecting', () => source.onNext({status: 'connecting'}));
    socket.on('connect_error', () => source.onNext({status: 'disconected'}));
    socket.on('connect_timeout', () => source.onNext({status: 'disconected'}));
    socket.on('reconnect_error', () => source.onNext({status: 'disconected'}));
    socket.on('reconnect_failed', () => source.onNext({status: 'disconected'}));
    return source;
};

const eventStream = (socket) => {
    const source = new Subject();
    socket.on('gameStarted', data => source.onNext({type: 'gameStarted', data}));
    socket.on('gameJoined', data => source.onNext({type: 'gameJoined', data}));
    socket.on('roundStarted', data => source.onNext({type: 'roundStarted', data}));
    socket.on('gameFinished', data => source.onNext({type: 'gameFinished', data}));
    socket.on('roundFinished', data => source.onNext({type: 'roundFinished', data}));
    socket.on('opponentPlay', data => source.onNext({type: 'opponentPlay', data}));
    socket.on('intervalChanged', data => source.onNext({type: 'intervalChanged', data})); //debugging
    return source;
};

export const getApi = (socket) => {
  return {
      sendCommand: (command) => socket.emit(command.type, command.payload),
      connectionStream: connectionStream(socket),
      eventStream: eventStream(socket)
  };
};
