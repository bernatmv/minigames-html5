import { gradients, getRandomGradient } from '../common/background';
import random from '../common/random';

const properties = {
    screen: {
        resolution: {
//            width: 750,
//            height: 1334
            width: parseInt(750 / 2),
            height: parseInt(1334 / 2)
        },
        backgroundGradient: getRandomGradient()
    }, 
    text: {
        style: {
            title: {
                fill: "#fff",
                font: "48px Cocon-Bold",
                stroke: "#000",
                strokeThickness: 12
            }
        }
    }
};

export default properties;