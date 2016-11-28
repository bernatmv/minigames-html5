import random from './random';
import Properties from '../config/properties';

export const gradients = 
[
    [   // TEST
        { position: 0, color: "#ffffff" },
        { position: 500/600, color: "#0a68b0" },
        { position: 500/600, color: "#0a68b0" },
        { position: 1, color: "#000000" }
    ],
    [   // Honey Dew
        { position: 0, color: "#43C6AC" },
        { position: 1, color: "#F8FFAE" }
    ],
    [   // Blue Lagoon
        { position: 0, color: "#43C6AC" },
        { position: 1, color: "#191654" }
    ],
    [   // Dawn
        { position: 0, color: "#F3904F" },
        { position: 1, color: "#3B4371" }
    ],
    [   // Purple White
        { position: 0, color: "#BA5370" },
        { position: 1, color: "#F4E2D8" }
    ],
    [   // Mild
        { position: 0, color: "#67B26F" },
        { position: 1, color: "#4ca2cd" }
    ]
];

export function addGradient(
    game, 
    width = Properties.screen.resolution.width, 
    height = Properties.screen.resolution.height, 
    orientation = 'vertical', 
    gradient = null
) {
    const bgGradient = gradient || gradients[random(0, gradients.length - 1)]; 
    const coordinates = (orientation === 'vertical') ? [0,0,0,height] : [0,0,width,0];

    const myBitmap = game.add.bitmapData(width, height);
    const grd = myBitmap.context.createLinearGradient(...coordinates);

    bgGradient.map((gradientStep) => grd.addColorStop(gradientStep.position,gradientStep.color));

    myBitmap.context.fillStyle = grd;
    myBitmap.context.fillRect(0,0,width,height);
    game.add.sprite(0, 0, myBitmap);
}