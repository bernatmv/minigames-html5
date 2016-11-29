import { Phaser } from 'phaser';

export function blinkTween(game, element, speed = 800, loop = true, start = true) {
    const tween = game.add.tween(element)
        .to({alpha: 0}, speed, Phaser.Easing.Linear.None)
        .to({alpha: 1}, speed, Phaser.Easing.Linear.None);
    if (loop) 
        tween.loop();
    if (start)
        tween.start();
    return tween;
}

export function beatTween(game, element, speed = 400, loop = true, start = true) {
    const tween = game.add.tween(element.scale)
        .to({x: 1.2, y: 1.2}, speed, Phaser.Easing.Linear.None)
        .to({x: 1, y: 1}, speed, Phaser.Easing.Linear.None);
    if (loop) 
        tween.loop();
    if (start)
        tween.start();
    return tween;
}