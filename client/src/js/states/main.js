import { State } from 'phaser';

class Main extends State {
    preload() {
        // connect with FB
    }
    create() {
        this.game.add.text(32, 32, 'jajaken', { fill: '#ffffff' });
	}
};

export default Main;
