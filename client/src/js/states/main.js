import Properties from '../config/properties';
import labelButton from '../common/labelButton';
import { getURLParameter } from '../common/utils';
import { createConnectionStatusDisplay, monitorConnectionStream } from '../common/connectionStatus';
import { State } from 'phaser';
import { startGame, play, joinGame } from '../actions';
import { blinkTween } from '../common/animations';
import { gradients, addGradient } from '../common/background';

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
      .initializeConnectionStream()
      .initializeEventStream()
      .startGame();
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
    // logo
    const companyLogo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 200, "companyLogo", this);
    companyLogo.anchor.x = .5;
    companyLogo.anchor.y = .5;
    // text
    const title = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Janken!', style);
    title.anchor.x = .5;
    title.anchor.y = .5;
    const blinkingTitle = blinkTween(this.game, title);
    return this;
  }

  startGame() {
    const userAb = 'Abraham';
    const userBe = 'Bernat';
    const fbidAb = 'AbId';
    const fbidBe = 'BeId';
    const { sendCommand } = this.game.api;
    const join = getURLParameter('join');
    if (join) {
      sendCommand(joinGame(join, userBe, fbidBe));
    } else {
      sendCommand(startGame(userAb, fbidAb));
    }
    return this;
  }

  fakeGame() {
    const {
      sendCommand
    } = this.game.api;
    const onPlay = () => {
      sendCommand(play(gameId, userBe, 'paper'));
    };
    this.game.add.button(this.game.world.centerX - 95, 300, 'rock', onPlay, this, 2, 1, 0);
    return this;
  }

  initializeEventStream() {
    const { eventStream } = this.game.api;
    eventStream
      .subscribe(e => {
        switch (e.type) {
          case 'gameStarted':
            console.log(`http://localhost:8080/webpack-dev-server/?join=${e.data.gameId}`);
            // todo show meesage waiting for player
            break;
          case 'gameJoined':
            console.log('joined', e);
            // todo show start game
            break;
          default:
            console.log('missing handler for event', e);
        }
      });
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
};

export default Main;
