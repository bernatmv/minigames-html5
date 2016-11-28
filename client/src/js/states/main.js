import { State } from 'phaser';

class Main extends State {
    
    preload() {
        // connect with FB
    }

    create() {
        const title = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'janken', { fill: '#ffffff' });
		title.anchor.x = .5;
		title.anchor.y = .5;
	}
};

export default Main;
