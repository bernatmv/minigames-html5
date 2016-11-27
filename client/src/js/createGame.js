import { Phaser } from 'phaser';
import { map } from 'lodash/fp';
import { Boot, Loading, Main } from './states';

export default function createGame(api) {
    const game = new Phaser.Game(750, 1334, Phaser.AUTO, '', Boot);
    const { eventStream, connectionStream, sendCommand} = api;
}
