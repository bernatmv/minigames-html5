import { State } from 'phaser';
import { startGame, play, joinGame } from '../actions';
import { blinkTween } from '../common/animations';
import {
    gradients, addGradient
} from '../common/background';

class Main extends State {

    preload() {
        // connect with FB (user, locale...)
    }

    create() {
      this.initialize();
    }
      initialize() {
        //solve blurry pixels
        this.game.renderer.renderSession.roundPixels = true;
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
          addGradient(this.game);
          // text
          const title = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Janken!', style);
          title.anchor.x = .5;
          title.anchor.y = .5;
          const blinkingTitle = blinkTween(this.game, title);
          return this;
      }

      fakeGame() {
        const userAb = 'Ab';
        const userBe = 'Bernat';
        const fbidAb = 'AbId';
        const fbidBe = 'BeId';
        const gameId = 'gameStarted';
        const { eventStream, sendCommand } =  this.game.api;

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
        return this;
      }

      initializeConnectionImages(){
        // todo create a spritesheet
        this.connection = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'connection');
        this.connection.visible = false;
        this.connection.anchor.x = 0.5;
        this.connection.anchor.y = 0.5;
        this.connectionTween = blinkTween(this.game, this.connection);
        this.connectionTween.pause();
        return this;
      };

      initializeConnectionStream(){
        const { connectionStream } =  this.game.api;
        connectionStream
          .distinctUntilChanged()
          .filter(msg => msg.status === 'disconected')
          .subscribe(() => {
            this.connection.visible = true;
            this.connectionTween.resume();
          });
          connectionStream
            .distinctUntilChanged()
            .filter(msg => msg.status === 'connected')
            .subscribe(() => {
              this.connection.visible = false;
              this.connectionTween.pause();
            });
        return this;
      }
};

export default Main;
