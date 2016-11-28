import {State} from 'phaser';

class Loading extends Phaser.State {
    preload() {
        // load assets
    }
    create() {
        this.game.add.text(32, 32, 'Loading...', { fill: '#ffffff' });
        setTimeout(() => this.game.state.start('main'), 1000);
	}
};

export default Loading;
