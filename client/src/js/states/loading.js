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
            font: "42px Cocon-Bold",
            fill: "#fff",
            stroke: "#000",
            strokeThickness: 8
        };
        // background
        addGradient(this.game, Properties.screen.backgroundGradient);
        // logo
        const companyLogo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 400, "companyLogo", this);
        companyLogo.anchor.x = .5;
        companyLogo.anchor.y = .5;
        // text
        const loadingText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, `Loading, please be patient...`, style);
        loadingText.anchor.setTo(0.5, 0.5);
        const preloadBar = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 100, '0%', style);
        preloadBar.anchor.setTo(0.5, 0.5);
        // load images
        //this.game.load.image("hand-rock", require("../../assets/hands/rock.png"));
        //this.game.load.image("hand-paper", require("../../assets/hands/paper.png"));
        //this.game.load.image("hand-scissors", require("../../assets/hands/scissors.png"));
        this.game.load.image("icon-rock", require("../../assets/icons/icon-rock.png"));
        this.game.load.image("icon-paper", require("../../assets/icons/icon-paper.png"));
        this.game.load.image("icon-scissors", require("../../assets/icons/icon-scissors.png"));
        this.game.load.image("icon-unknown", require("../../assets/icons/icon-unknown.png"));
        this.game.load.image("connection", require("../../assets/icons/connection_status.png"));
        //this.game.load.atlas("buttons", require("../../assets/buttons/circle/sprites.png"), null, buttonsJSON, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        //this.game.load.image("button-rock", require("../../assets/buttons/circle/button-rock.png"));
        //this.game.load.image("button-paper", require("../../assets/buttons/circle/button-paper.png"));
        //this.game.load.image("button-scissors", require("../../assets/buttons/circle/button-scissors.png"));
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
