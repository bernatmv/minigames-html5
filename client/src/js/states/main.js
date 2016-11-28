import { State } from 'phaser';
import {
    blinkTween
} from '../common/animations';

class Main extends State {
    
    preload() {
        // connect with FB (user, locale...)
    }

    create() {
        // font style
        const style = {
            font: "48px Cocon-Bold",
			fill: "#fff",
            stroke: "#000",
            strokeThickness: 12
		};
        // text
        const title = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Janken!', style);
		title.anchor.x = .5;
		title.anchor.y = .5;
        const blinkTween = blinkTween(this.game, title);

        //solve blurry pixels
		this.game.renderer.renderSession.roundPixels = true;
	}
};

export default Main;
