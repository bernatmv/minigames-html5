import Properties from '../config/properties';
import { blinkTween } from '../common/animations';

export function createConnectionStatusDisplay(game) {
    const connectionImage = game.add.sprite(Properties.screen.resolution.width - 50, 50, 'connection');
    connectionImage.visible = false;
    connectionImage.anchor.x = 0.5;
    connectionImage.anchor.y = 0.5;
    const connectionTween = blinkTween(game, connectionImage);
    connectionTween.pause();
    return {
        connectionLost: () => {
            connectionImage.visible = true;
            connectionTween.resume();
        },
        connectionResumed: () => {
            connectionImage.visible = false;
            connectionTween.pause();
        }
    };
};

export function monitorConnectionStream(connectionStream, connectionStatus) {
    connectionStream
        .distinctUntilChanged()
        .filter(msg => msg.status === 'disconected')
        .subscribe(() => connectionStatus.connectionLost());
        connectionStream
        .distinctUntilChanged()
        .filter(msg => msg.status === 'connected')
        .subscribe(() => connectionStatus.connectionResumed());
    return this;
}