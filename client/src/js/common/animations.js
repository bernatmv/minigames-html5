import random from './random';

export const blinkTween = (game, element, speed = 800, loop = true, start = true) => {
    const tween = game.add.tween(element)
        .to({
            alpha: 0
        }, speed, Phaser.Easing.Linear.None)
        .to({
            alpha: 1
        }, speed, Phaser.Easing.Linear.None);
    if (loop)
        tween.loop();
    if (start)
        tween.start();
    return tween;
};