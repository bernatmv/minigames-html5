import { State } from 'phaser';
import { startGame, play, joinGame } from '../actions';
import { blinkTween } from '../common/animations';

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
        const userAb = 'Ab';
        const userBe = 'Bernat';
        const fbidAb = 'AbId';
        const fbidBe = 'BeId';
        const gameId = 'gameStarted';
        const { eventStream, connectionStream, sendCommand } =  this.game.api;

        // text
        const title = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Janken!', style);
        title.anchor.x = .5;
        title.anchor.y = .5;
        //const blinkTween = blinkTween(this.game, title);


        //solve blurry pixels
        this.game.renderer.renderSession.roundPixels = true;

        const onStart = () => {
            sendCommand(startGame(userAb, fbidAb));
        };
        this.game.add.button(this.game.world.centerX - 95, 100, 'start',onStart, this, 2, 1, 0);


        const onJoin = () => {
            sendCommand(joinGame(gameId, userBe, fbidBe));
        };
        this.game.add.button(this.game.world.centerX - 95, 200, 'join',onJoin, this, 2, 1, 0);


        const onPlay = () => {
            sendCommand(play(gameId, userBe, 'paper'));
        };
        this.game.add.button(this.game.world.centerX - 95, 300, 'play',onPlay, this, 2, 1, 0);

	}
};

export default Main;
