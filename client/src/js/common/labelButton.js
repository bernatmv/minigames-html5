import {Phaser} from 'phaser';

export default function labelButton(game, x, y, key, label, labelStyle, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {
    debugger;
    Phaser.Button.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
    this.style = labelStyle;
    this.anchor.setTo(0.5, 0.5);
    this.label = new Phaser.Text(game, 0, 0, label, this.style);
    this.label.anchor.setTo(0.5, 0.5);
    this.addChild(this.label);
    this.setLabel(label);
    game.add.existing(this);
};

labelButton.prototype = Object.create(Phaser.Button.prototype);
labelButton.prototype.constructor = labelButton;
labelButton.prototype.setLabel = function( label ) {
    this.label.setText(label);
};