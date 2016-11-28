import { Phaser } from 'phaser';
import { map } from 'lodash/fp';
import { Boot, Loading, Main } from './states';
import Properties from './config/properties';

export default function createGame(api) {
    const game = new Phaser.Game(Properties.screen.resolution.width, Properties.screen.resolution.height, Phaser.SHOW_ALL, '', Boot);
    const { eventStream, connectionStream, sendCommand} = api;
}