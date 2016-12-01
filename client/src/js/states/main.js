import { State } from 'phaser';
import { startGame, play, joinGame } from '../actions';
import { blinkTween } from '../common/animations';
import { getURLParameter } from '../common/utils';
import Properties from '../config/properties';
import {
    createConnectionStatusDisplay, monitorConnectionStream
} from '../common/connectionStatus';
import {
    gradients, addGradient
} from '../common/background';
import labelButton from '../common/labelButton';

class Main extends State {

  preload() {
      // connect with FB (user, locale...)
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

  fakeGame() {
    const userAb = 'Abraham';
    const userBe = 'Bernat';
    const fbidAb = 'AbId';
    const fbidBe = 'BeId';
    const gameId = 'gameStarted';
    const { eventStream, sendCommand } =  this.game.api;

    this.initializeMenu();

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

  initializeMenu() {
    const currentGameId = getURLParameter('gameId');
    console.log(currentGameId);
    if (currentGameId) {
      // join button
      this.createJoinButton();
    }
    else {
      // start button
      this.createStartButton();
    }
  }

  createStartButton() {
    const onStart = () => {
        const { eventStream } = this.game.api; 
        sendCommand(startGame(userAb, fbidAb));
        eventStream.on('gameStarted', data => {
          console.log('game started!!!!!!!!');
        });
    };
    labelButton(this.game, this.game.world.centerX, this.game.world.centerY + 200, 'button-blue', 'Create game', Properties.text.style.title, onStart, this);
  }

  createJoinButton() {
    const onJoin = () => {
        sendCommand(joinGame(gameId, userBe, fbidBe));
    };
    this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200, 'button-blue', onJoin, this);
  }
};

export default Main;