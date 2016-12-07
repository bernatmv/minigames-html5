import random from './random';
import Properties from '../config/properties';

export const gradients =
[
    [   // Honey Dew
        { position: 0, color: "#43C6AC" },
        { position: 1, color: "#F8FFAE" }
    ]
];

export function getRandomGradient() {
    return gradients[random(0, gradients.length - 1)];
}

export function addGradient(
    game,
    gradient = null,
    orientation = 'vertical',
    width = Properties.screen.resolution.width,
    height = Properties.screen.resolution.height
) {
    const bgGradient = gradient || gradients[random(0, gradients.length - 1)];
    const coordinates = (orientation === 'vertical') ? [0,0,0,height] : [0,0,width,0];

    const myBitmap = game.add.bitmapData(width, height);
    const grd = myBitmap.context.createLinearGradient(...coordinates);

    bgGradient.map((gradientStep) => grd.addColorStop(gradientStep.position, gradientStep.color));

    myBitmap.context.fillStyle = grd;
    myBitmap.context.fillRect(0,0,width,height);
    game.add.sprite(0, 0, myBitmap);
}
