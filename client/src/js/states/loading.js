import {State} from 'phaser';
import Properties from '../config/properties';
import {
    gradients, addGradient
} from '../common/background';

class Loading extends Phaser.State {

    preload() {
        // font style
        const style = {
			fill: "#ffffff"
		};
        // background
        addGradient(this.game);
        // logo
        const companyLogo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 250, 'companyLogo', this);
		companyLogo.anchor.x = .5;
		companyLogo.anchor.y = .5;
        // text
        const loadingText = this.game.add.text(this.game.width / 2, (this.game.height / 2) - 50, `Loading, please be patient...`, style);
		loadingText.anchor.setTo(0.5, 0.5);
		const preloadBar = this.game.add.text(this.game.width / 2, (this.game.height / 2) + 50, '0%', style);
		preloadBar.anchor.setTo(0.5, 0.5);
        // load images
        this.game.load.image("rock", require("../../assets/icons/rock.png"));
        this.game.load.image("paper", require("../../assets/icons/paper.png"));
        this.game.load.image("scissors", require("../../assets/icons/scissors.png"));
        this.game.load.image("lizard", require("../../assets/icons/lizard.png"));
        this.game.load.image("spock", require("../../assets/icons/spock.png"));
        this.game.load.image("rules_rock_paper_scissors", require("../../assets/rules/rock-paper-scissors.png"));
        this.game.load.image("rules_rock_papaer_scissors_lizard_spock", require("../../assets/rules/rock_papaer_scissors_lizard_spock.jpg"));

        const loadCheck = () => {
			if (this.game.load.hasLoaded) {
				this.game.load.onLoadComplete.remove(loadCheck, this);
				this.game.state.start('main');
			}
		};

        this.game.load.onFileComplete.add(() => this.loadUpdate());
		this.game.load.onPackComplete.add(() => this.loadUpdate());
		this.game.load.onLoadComplete.add(() => {
            preloadBar.text = this.game.load.progress + '%';
        }, this);
    }
};

export default Loading;