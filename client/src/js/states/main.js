import Properties from '../config/properties';
import { getURLParameter } from '../common/utils';
import { createConnectionStatusDisplay, monitorConnectionStream } from '../common/connectionStatus';
import { State } from 'phaser';
import { startGame, play, joinGame } from '../actions';
import { blinkTween } from '../common/animations';
import { gradients, addGradient } from '../common/background';
import Button from '../common/button';

class Main extends State {

  preload() {
    // connect with FB (user, locale...)
  }

  create() {
    this.gameId = null;
    this.user = null;
    this.round = null;
    this.isOwner = null;
    this.initialize();
  }

  initialize() {
    //solve blurry pixels
    this.game.renderer.renderSession.roundPixels = true;
    return this
      .initializeStage()
      .initializeConnectionImages()
      .initializeConnectionStream()
      .initializeEventStream()
      .startGame();
  }

  initializeStage() {
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
    this.marquee = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Janken!', style);
    this.marquee.anchor.x = .5;
    this.marquee.anchor.y = .5;
    const blinkingMarquee = blinkTween(this.game, this.marquee);
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
      this.user = userBe;
      this.isOwner = false;
      sendCommand(joinGame(join, userBe, fbidBe));
    } else {
      this.user = userAb;
      this.isOwner = true;
      sendCommand(startGame(userAb, fbidAb));
    }
    return this;
  }

  initializeEventStream() {
    const { eventStream } = this.game.api;
    eventStream
      .subscribe(e => {
        switch (e.type) {
          case 'gameStarted':
            this.gameId = e.data.gameId;
            console.log(`http://localhost:8080/webpack-dev-server/?join=${e.data.gameId}`);
            // todo show meesage waiting for player
            break;
          case 'gameJoined':
            // TODO: display other player
            console.log('joined', e);
            this.gameId = e.data.gameId;
            // TODO: show start game
            break;
          case 'roundStarted':
            console.log('round started', e);
            this.round = e.data.round;
            this.createHandsButtons();
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

  createHandsButtons() {
      const {sendCommand} = this.game.api;
      const playCommand = (hand) => {
          sendCommand(play(this.gameId, this.round, this.user, this.isOwner, hand));
      };
      
      const onPlayRock = () => playCommand('rock');
      const onPlayPaper = () => playCommand('paper');
      const onPlayScissors = () => playCommand('scissors');
      const scale = 0.4; // TODO: re-scale assets and remove
      const rockButton = new Button(this.game, this.game.world.centerX, Properties.screen.resolution.height - 250, 'icon-rock', null, null, onPlayRock, this);
      rockButton.scale.setTo(scale, scale);
      this.game.stage.addChild(rockButton);
      const paperButton = new Button(this.game, this.game.world.centerX -100, Properties.screen.resolution.height - 100, 'icon-paper', null, null, onPlayPaper, this)
      paperButton.scale.setTo(scale, scale);
      this.game.stage.addChild(paperButton);
      const scissorsButton = new Button(this.game, this.game.world.centerX + 100, Properties.screen.resolution.height - 100, 'icon-scissors', null, null, onPlayScissors, this)
      scissorsButton.scale.setTo(scale, scale);
      this.game.stage.addChild(scissorsButton);
      return this;
  }
};

export default Main;
