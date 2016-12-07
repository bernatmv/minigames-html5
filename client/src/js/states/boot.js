import { State } from 'Phaser';
import Loading from './loading';
import Main from './main';
import Properties from '../config/properties';
import {
    gradients, addGradient
} from '../common/background';

class Boot extends State {

    preload() {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.load.image("companyLogo", require("../../assets/logos/logo_300x200.png"));
    		this.game.stage.disableVisibilityChange = true;
        this.game.state.add('loading', Loading);
        this.game.state.add('main', Main);
    }

    create() {
        // this.game.scale.windowConstraints.bottom = "visual";
        this.game.scale.pageAlignVertically = true;
        this.game.scale.pageAlignHorizontally = true;
        this.game.stage.disableVisibilityChange = true;
        this.game.input.maxPointers = 1;
        if (Phaser.Plugin.Debug){
            this.game.add.plugin(Phaser.Plugin.Debug);
        }
        addGradient(this.game, Properties.screen.backgroundGradient);
        this.game.state.start('loading');
	}
};

export default Boot;
