import Properties from '../config/properties';
import { getURLParameter } from '../common/utils';
import { createConnectionStatusDisplay, monitorConnectionStream } from '../common/connectionStatus';
import { State } from 'phaser';
import { startGame, play, joinGame } from '../actions';
import { blinkTween, beatTween } from '../common/animations';
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
    this.companyLogo = null;
    this.playsGroup = null;
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
      font: "42px Cocon-Bold",
      stroke: "#000",
      strokeThickness: 8
    };
    // background
    addGradient(this.game, Properties.screen.backgroundGradient);
    // logo
    this.companyLogo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 400, "companyLogo", this);
    this.companyLogo.anchor.x = .5;
    this.companyLogo.anchor.y = .5;
    // text
    this.marquee = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Awaiting opponent...', styleBig);
    this.marquee.anchor.x = .5;
    this.marquee.anchor.y = 0;
    this.blinkingMarquee = blinkTween(this.game, this.marquee);
    // groups
    this.playsGroup = this.game.add.group();
    const maskGraphics = this.game.add.graphics(0,0);
    maskGraphics.beginFill(200, 100, 0 , 0);
    maskGraphics.drawRect(0, 150, Properties.screen.resolution.width, 800);
    maskGraphics.endFill();
    this.playsGroup.mask = maskGraphics;
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
            console.log(`?join=${e.data.gameId}`);
            console.log(`http://localhost:8080/?join=${e.data.gameId}`);
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
            this.setRightColumnHand('unknown');
            break;
          case 'roundFinished':
            console.log('round finished', e);
            this.setRightColumnHand(e.data.otherHand, true);
            this.setRoundWinner(e.data.winner);
            this.round = e.data.round;
            break;
          case 'gameFinished':
            console.log('game finished', e);
            this.setWinLoseMessage(e.data.winner);
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
      font: "28px Cocon-Bold",
      stroke: "#000",
      strokeThickness: 6
    };
    const yOffset = 120;
    this.yourPlay = this.game.add.text(10, yOffset, 'Your play', styleNormal);
    this.yourPlay.anchor.x = 0;
    this.yourPlay.anchor.y = .5;
    this.opponentPlay = this.game.add.text(Properties.screen.resolution.width - 10, yOffset, 'Opponent play', styleNormal);
    this.opponentPlay.anchor.x = 1;
    this.opponentPlay.anchor.y = .5;
    this.winner = this.game.add.text(this.game.world.centerX, yOffset, 'Winner', styleNormal);
    this.winner.anchor.x = .5;
    this.winner.anchor.y = .5;
    this.companyLogo.destroy();
    if (game.ownerId === this.user) {
      this.marquee.text = 'Playing with ' + game.guestId;
    }
    else {
      this.marquee.text = 'Playing with ' + game.ownerId;
    }
    this.marquee.y = 0;
    this.marquee.addColor('#fe8c00', 13);
    this.marquee.alpha = 1;
    this.blinkingMarquee.stop();
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
      const scale = .9;
      this.rockButton = new Button(this.game, this.game.world.centerX - 255, Properties.screen.resolution.height - 200, 'icon-rock', null, null, onPlayRock, this);
      this.rockButton.scale.setTo(scale, scale);
      this.game.stage.addChild(this.rockButton);
      this.paperButton = new Button(this.game, this.game.world.centerX, Properties.screen.resolution.height - 200, 'icon-paper', null, null, onPlayPaper, this)
      this.paperButton.scale.setTo(scale, scale);
      this.game.stage.addChild(this.paperButton);
      this.scissorsButton = new Button(this.game, this.game.world.centerX + 255, Properties.screen.resolution.height - 200, 'icon-scissors', null, null, onPlayScissors, this)
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

  setRoundWinner(winner) {
    const color = (winner === 'draw') ? '#FFE02D' : ((winner === this.user) ? '#37CF57' : '#E82C0C');
    const text = (winner === 'draw') ? 'Draw' : ((winner === this.user) ? 'You win!' : 'You lose');
    const styleSmall = {
      fill: "#fff",
      font: "28px Cocon-Bold",
      stroke: "#000",
      strokeThickness: 4
    };
    const styleNormal = {
      fill: color,
      font: "48px Cocon-Bold",
      stroke: "#fff",
      strokeThickness: 8
    };
    const roundText = this.game.add.text(this.game.world.centerX, 40 + (this.round * 160), 'Round ' + this.round, styleSmall);
    roundText.anchor.x = .5;
    roundText.anchor.y = .5;
    this.playsGroup.add(roundText);
    const winnerText = this.game.add.text(this.game.world.centerX, 85 + (this.round * 160), text, styleNormal);
    winnerText.anchor.x = .5;
    winnerText.anchor.y = .5;
    this.playsGroup.add(winnerText);
    if (this.round > 4) {
      this.playsGroup.y -= 160;
    }
  }

  setLeftColumnHand(hand) {
    if (this.leftColumnHand) {
      //this.leftColumnHand.destroy();
    }
    this.leftColumnHand = this.game.add.sprite(10, -10 + (this.round * 160), 'icon-' + hand, this);
    this.leftColumnHand.scale.setTo(0.6, 0.6);
    this.playsGroup.add(this.leftColumnHand);
  }

  setRightColumnHand(hand, update = false) {
    if (this.rightColumnHand && update) {
      this.rightColumnHand.destroy();
    }
    this.rightColumnHand = this.game.add.sprite(Properties.screen.resolution.width - 10, -10 + (this.round * 160), 'icon-' + hand, this);
    this.rightColumnHand.scale.setTo(0.6, 0.6);
    this.rightColumnHand.anchor.x = 1;
    this.playsGroup.add(this.rightColumnHand);
  }

  setWinLoseMessage(winner) {
    const styleBig = {
      font: "120px Cocon-Bold",
      stroke: "#000",
      strokeThickness: 10
    };
    const finalText = this.game.add.text(this.game.world.centerX, Properties.screen.resolution.height - 400, (winner === this.user) ? `YOU WIN` : `YOU LOSE`, styleBig);
    finalText.anchor.set(0.5, 0.5);

    var grd = finalText.context.createLinearGradient(0, 0, 0, finalText.height);
    grd.addColorStop(0, (winner === this.user) ? '#DCE35B' : '#fe8c00');
    grd.addColorStop(1, (winner === this.user) ? '#45B649' : '#f83600');
    finalText.fill = grd;
    beatTween(this.game, finalText);
  }
};

export default Main;
