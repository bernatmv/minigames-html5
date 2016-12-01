import {State} from 'phaser';
import Properties from '../config/properties';
import {
    gradients, addGradient
} from '../common/background';

class Loading extends Phaser.State {

    preload() {
        //solve blurry pixels
        this.game.renderer.renderSession.roundPixels = true;        
        // font style
        const style = {
            font: "24px Cocon-Bold",
            fill: "#fff",
            stroke: "#000",
            strokeThickness: 6
        };
        // background
        addGradient(this.game, Properties.screen.backgroundGradient);
        // logo
        const companyLogo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 200, "companyLogo", this);
        companyLogo.anchor.x = .5;
        companyLogo.anchor.y = .5;
        // text
        const loadingText = this.game.add.text(this.game.width / 2, (this.game.height / 2) - 50, `Loading, please be patient...`, style);
        loadingText.anchor.setTo(0.5, 0.5);
        const preloadBar = this.game.add.text(this.game.width / 2, (this.game.height / 2) + 50, '0%', style);
        preloadBar.anchor.setTo(0.5, 0.5);
        // load images
        this.game.load.image("rock", require("../../assets/hands/rock.png"));
        this.game.load.image("paper", require("../../assets/hands/paper.png"));
        this.game.load.image("scissors", require("../../assets/hands/scissors.png"));
        this.game.load.image("connection", require("../../assets/icons/connection_status.png"));
        this.game.load.spritesheet("button-blue", require("../../assets/buttons/circle/BlueButton.png"), 400, 400);
        this.game.load.image("button-greeen", require("../../assets/buttons/circle/GreenButton.png"));
        this.game.load.image("button-grey", require("../../assets/buttons/circle/GreyButton.png"));
        this.game.load.image("button-pink", require("../../assets/buttons/circle/PinkButton.png"));
        this.game.load.image("button-purple", require("../../assets/buttons/circle/PurpleButton.png"));
        this.game.load.image("button-purple-light", require("../../assets/buttons/circle/PurpleLightButton.png"));
        this.game.load.image("button-rose", require("../../assets/buttons/circle/RoseButton.png"));
        this.game.load.image("button-turquoise", require("../../assets/buttons/circle/TurquoiseButton.png"));
        this.game.load.image("button-yellow", require("../../assets/buttons/circle/YellowButton.png"));
        
        const loadCheck = () => {
            preloadBar.text = this.game.load.progress + '%';
        };

        this.game.load.onFileComplete.add(loadCheck);
        this.game.load.onPackComplete.add(loadCheck);
        this.game.load.onLoadComplete.add(() => {
            preloadBar.text = this.game.load.progress + '%';
            //TODO REMOVE
            setTimeout(()=>this.game.state.start('main'), 1000);
        }, this);
    }

};

export default Loading;
