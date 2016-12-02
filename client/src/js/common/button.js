import {Phaser} from 'phaser';

export default class Button extends Phaser.Button {
	constructor(game, x, y, key, label, labelStyle, callback, callbackContext, overFrame, outFrame, downFrame, disabledFrame, outCallback) {
		super(game, x, y, key, undefined, undefined, overFrame, outFrame, downFrame);
		this.onInputUp.add(this.callbackHandler, this);
		this.setStateFrame('Disabled', disabledFrame);
		this.input.useHandCursor = true;
		this.disabled = false;
		this.mouseIsOver = false;
		this.buttonCallback = callback;
		this.buttonCallbackContext = callbackContext;
		this.hotkeys = [];
        this.anchor.setTo(0.5, 0.5);

		this.events.onInputOver.add(() => this.mouseIsOver = true, this);
		//Passed to a function that doesn't return false because if false is returned, all the events are stopped.
		this.events.onInputOut.add(() => {
			this.mouseIsOver = false;
		}, this);

        this.label = new Phaser.Text(game, 0, 0, label, labelStyle);
        this.label.anchor.setTo(0.5, 0.5);
        this.addChild(this.label);
        this.setLabel(label);
	}

    setLabel(label) {
        this.label.setText(label);
        return this;
    }

	addHotkey(key, repeat = false) {
		const hotkey = this.game.input.keyboard.addKey(key);
		if (repeat) {
			hotkey.onDown.add(this.startRepeat, this);
			hotkey.onUp.add(this.stopRepeat, this);
			if (window !== undefined) window.addEventListener('blur', () => this.stopRepeat(), true);
		} else {
			hotkey.onDown.add(this.callbackHandler, this);
		}
		this.hotkeys.push(hotkey);
	}

	disable() {
		this.disabled = true;
		this.changeStateFrame('Disabled');
		this.input.useHandCursor = false;
		this.freezeFrames = true;
	}

	enable() {
		this.disabled = false;
		this.freezeFrames = false;
		this.input.useHandCursor = true;
		this.changeStateFrame(this.mouseIsOver ? 'Over' : 'Out');
	}

	callbackHandler() {
		if (this.disabled || !this.buttonCallback) return false;
		this.buttonCallback.apply(this.buttonCallbackContext, arguments);
        return true;
	}

	setFrames(overFrame, outFrame, downFrame, disabledFrame) {
		super.setFrames(overFrame, outFrame, downFrame);
		this.setStateFrame('Disabled', disabledFrame);
	}

	startRepeat() {
		if (!this.loop) {
			if (this.callbackHandler(arguments)) {
                this.onKeyDown();
            }
			this.loop = this.game.time.events.loop(200, () => this.callbackHandler(arguments), this);
		}
	}

    onKeyDown() {}
    onKeyUp() {}

	stopRepeat() {
		if (this.loop) {
            this.onKeyUp();
			this.game.time.events.remove(this.loop);
			this.loop = undefined;
		}
	}
}