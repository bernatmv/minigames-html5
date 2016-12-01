import { State } from 'phaser';
import { play } from '../actions';
import { blinkTween } from '../common/animations';
import { getURLParameter } from '../common/utils';
import Properties from '../config/properties';
import {
    createConnectionStatusDisplay, monitorConnectionStream
} from '../common/connectionStatus';
import {
    gradients, addGradient
} from '../common/background';

class Play extends State {

    preload() {
        // empty
    }

    create() {
        this.initialize();
    }

    initialize() {
        return this.fakeGame()
            .initializeText()
            .initializeConnectionImages()
            .initializeConnectionStream();
    }

    initializeText() {
        // font style
        const style = {
            fill: "#fff",
            font: "48px Cocon-Bold",
            stroke: "#000",
            strokeThickness: 12
        };
        // background
        addGradient(this.game, Properties.screen.backgroundGradient);
        // text
        const title = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Janken!', style);
        title.anchor.x = .5;
        title.anchor.y = .5;
        const blinkingTitle = blinkTween(this.game, title);
        return this;
    }

    fakeGame() {
        const userAb = 'Abraham';
        const userBe = 'Bernat';
        const fbidAb = 'AbId';
        const fbidBe = 'BeId';
        const gameId = 'gameStarted';
        const { eventStream, sendCommand } =  this.game.api;

        this.createHandsButtons();

        return this;
    }

    initializeConnectionImages() {
        this.connectionStatus = createConnectionStatusDisplay(this.game);
        return this;
    };

    initializeConnectionStream() {
        const { connectionStream } = this.game.api;
        monitorConnectionStream(connectionStream, this.connectionStatus);
        return this;
    }

    createHandsButtons() {
        const playCommand = (hand) => {
            sendCommand(play(gameId, userBe, hand));
        };
        const onPlayRock = () => playCommand('rock');
        const onPlayPaper = () => playCommand('paper');
        const onPlayScissors = () => playCommand('scissors');
        this.game.add.button(this.game.world.centerX - 100, Properties.screen.resolution.height - 100, 'playRock', onPlayRock, this);
        this.game.add.button(this.game.world.centerX, Properties.screen.resolution.height - 100, 'playPaper', onPlayPaper, this);
        this.game.add.button(this.game.world.centerX + 100, Properties.screen.resolution.height - 100, 'playScissors', onPlayScissors, this);
    }
};

export default Play;