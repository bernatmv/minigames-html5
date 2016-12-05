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
    // data
    this.gameId = null;
    this.user = null;
    this.round = null;
    // UI
    this.rockButton = null;
    this.paperButton = null;
    this.scissorButton = null;
    this.leftColumnHand = null;
    this.rightColumnHand = null;
    // start
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
    const styleBig = {
      fill: "#fff",
      font: "32px Cocon-Bold",
      stroke: "#000",
      strokeThickness: 7
    };
    // background
    addGradient(this.game, Properties.screen.backgroundGradient);
    // text
    this.marquee = this.game.add.text(this.game.world.centerX, 0, 'Awaiting opponent...', styleBig);
    this.marquee.anchor.x = .5;
    this.marquee.anchor.y = 0;
    this.blinkingMarquee = blinkTween(this.game, this.marquee);
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
      this.user = fbidBe;
      sendCommand(joinGame(join, userBe, fbidBe));
    } else {
      this.user = fbidAb;
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
            break;
          case 'gameJoined':
            console.log('joined', e);
            this.gameId = e.data.gameId;
            this.gameReady(e.data);
            break;
          case 'roundStarted':
            console.log('round started', e);
            this.round = e.data.round;
            this.createHandsButtons();
            break;
          case 'opponentPlay':
            console.log('opponent played', e);
            this.setRightColumnHand();
            break;
          case 'roundFinished':
            console.log('round finished', e);
            this.round = e.data.round;
            if (e.data.winner === 'draw') {
              console.log('DRAW!');
            } else if (e.data.winner === this.user) {
              console.log('YOU WIN!');
            } else {
              console.log('YOU LOSE!');
            }
            break;            
          case 'gameFinished':
            console.log('game finished', e);
            if (e.data.winner === this.user) {
              console.log('YOU WIN THE GAME!');
            } else {
              console.log('YOU LOSE THE GAME!');
            }
            break;            
          default:
            console.log('missing handler for event', e);
        }
      });
    return this;
  }

  gameReady(game) {
    const styleNormal = {
      fill: "#fff",
      font: "16px Cocon-Bold",
      stroke: "#000",
      strokeThickness: 3
    };
    const yOffset = 60;
    this.yourPlay = this.game.add.text(5, yOffset, 'Your play', styleNormal);
    this.yourPlay.anchor.x = 0;
    this.yourPlay.anchor.y = .5;
    this.opponentPlay = this.game.add.text(Properties.screen.resolution.width - 5, yOffset, 'Opponent play', styleNormal);
    this.opponentPlay.anchor.x = 1;
    this.opponentPlay.anchor.y = .5;
    this.winner = this.game.add.text(this.game.world.centerX, yOffset, 'Winner', styleNormal);
    this.winner.anchor.x = .5;
    this.winner.anchor.y = .5;
    if (game.ownerId === this.user) {
      this.marquee.text = game.ownerId + ' vs ' + game.guestId;
      this.blinkingMarquee.stop();
    }
    else {
      this.marquee.text = game.guestId + ' vs ' + game.ownerId;
      this.blinkingMarquee.stop();
    }
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
        this.removeButtons();
        this.setLeftColumnHand(hand);
        sendCommand(play(this.gameId, this.round, this.user, hand));
      };
      
      const onPlayRock = () => playCommand('rock');
      const onPlayPaper = () => playCommand('paper');
      const onPlayScissors = () => playCommand('scissors');
      const scale = 0.4; // TODO: re-scale assets and remove
      this.rockButton = new Button(this.game, this.game.world.centerX, Properties.screen.resolution.height - 250, 'icon-rock', null, null, onPlayRock, this);
      this.rockButton.scale.setTo(scale, scale);
      this.game.stage.addChild(this.rockButton);
      this.paperButton = new Button(this.game, this.game.world.centerX -100, Properties.screen.resolution.height - 100, 'icon-paper', null, null, onPlayPaper, this)
      this.paperButton.scale.setTo(scale, scale);
      this.game.stage.addChild(this.paperButton);
      this.scissorsButton = new Button(this.game, this.game.world.centerX + 100, Properties.screen.resolution.height - 100, 'icon-scissors', null, null, onPlayScissors, this)
      this.scissorsButton.scale.setTo(scale, scale);
      this.game.stage.addChild(this.scissorsButton);
      return this;
  }

  restartUI() {
    removeButtons();
    this.leftColumnHand.destroy();
    this.rightColumnHand.destroy();
  }

  removeButtons() {
    this.rockButton.destroy();
    this.paperButton.destroy();
    this.scissorsButton.destroy();
  }

  setLeftColumnHand(hand) {
    if (this.leftColumnHand) {
      this.leftColumnHand.destroy();
    }
    this.leftColumnHand = this.game.add.sprite(5, 75, 'icon-' + hand, this);
    this.leftColumnHand.scale.setTo(0.25, 0.25);
  }

  setRightColumnHand() {
    if (this.rightColumnHand) {
      this.rightColumnHand.destroy();
    }
    this.rightColumnHand = this.game.add.sprite(Properties.screen.resolution.width - 5, 75, 'icon-spock', this);
    this.rightColumnHand.scale.setTo(0.25, 0.25);
    this.rightColumnHand.anchor.x = 1;
    this.rightColumnHand.anchor.y = .5;
  }
};

export default Main;
