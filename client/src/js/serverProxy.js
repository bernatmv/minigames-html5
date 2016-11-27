import io from 'socket.io-client';
import * as Rx from 'rx';

export const getSocket = (url = 'http://localhost:9000') => io.connect(url);

const connectionStream = (socket) =>{
    const source = new Rx.Subject();
    socket.on('connect', () => source.onNext({status: 'connected'}));
    socket.on('reconnecting', () => source.onNext({status: 'connecting'}));
    socket.on('connect_error', () => source.onNext({status: 'disconected'}));
    socket.on('connect_timeout', () => source.onNext({status: 'disconected'}));
    socket.on('reconnect_error', () => source.onNext({status: 'disconected'}));
    socket.on('reconnect_failed', () => source.onNext({status: 'disconected'}));
    return source;
};

const eventStream = (socket) => {
    const source = new Rx.Subject();
    socket.on('gameStarted', data => source.onNext({type: 'gameStarted', data}));
    socket.on('roundStarted', data => source.onNext({type: 'roundStarted', data}));
    socket.on('gameFinished', data => source.onNext({type: 'gameFinished', data}));
    socket.on('roundFinished', data => source.onNext({type: 'roundFinished', data}));
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
