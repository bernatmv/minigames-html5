import { State } from 'phaser';
import { startGame, play, joinGame } from '../actions';

class Main extends State {

    preload() {
        // connect with FB
    }

    create() {
        const userAb = 'Ab';
        const userBe = 'Bernat';
        const fbidAb = 'AbId';
        const fbidBe = 'BeId';
        const gameId = 'gameStarted';
        const { eventStream, connectionStream, sendCommand } =  this.game.api;
        const title = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'janken', { fill: '#ffffff' });
        title.anchor.x = .5;
        title.anchor.y = .5;


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
