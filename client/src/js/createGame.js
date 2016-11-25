import { Phaser } from 'phaser';

export default function createGame(api) {
    const game = new Phaser.Game(750, 1334, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    const {eventStream, connectionStream, sendCommand} = api;
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
