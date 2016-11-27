import { State } from 'Phaser';
import Main from './main';
import Loading from './loading';

class Boot extends State {
    preload() {
        //load basic info
        //this.game.load.image("loadingBackground", require("../assets/shared/loading-background.png"));
            this.game.state.add('loading', Loading);
            this.game.state.add('main', Main);
    }
    create() {
        this.game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.pageAlignHorizontally = true;
        this.game.stage.disableVisibilityChange = true;
        this.game.input.maxPointers = 1;
        if (Phaser.Plugin.Debug){
            this.game.add.plugin(Phaser.Plugin.Debug);
        }
        this.game.stage.backgroundColor = '#182d3b';
        this.game.state.start('loading');
	}
};

export default Boot;
