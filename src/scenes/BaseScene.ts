import * as Phaser from "phaser";

export default class BaseScene extends Phaser.Scene {
  constructor(key: string) {
    super(key);
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("back", "assets/back.png");
  }

  create() {
    this.scene.start("MenuScene");
  }

  createBackground() {
    this.add
      .image(
        Number(this.game.config.width) / 2,
        Number(this.game.config.height) / 2,
        "sky"
      )
      .setScrollFactor(0);
  }

  createBackBtnForInfoScene() {
    const backButton = this.add
      .image(
        Number(this.game.config.width) - 10,
        Number(this.game.config.height) - 10,
        "back"
      )
      .setOrigin(1)
      .setScale(2)
      .setInteractive();

    backButton.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }

  handleBackToMenuFromInfo() {
    let cursors, isSpaceJustPressed, isEnterJustPressed, isEscapeJustPressed;

    if (this.input && this.input.keyboard) {
      cursors = this.input.keyboard.createCursorKeys();
      isSpaceJustPressed = Phaser.Input.Keyboard.JustDown(cursors.space);
      isEnterJustPressed = Phaser.Input.Keyboard.JustDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      );
      isEscapeJustPressed = Phaser.Input.Keyboard.JustDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      );
    } else {
      console.error("Input or keyboard is not available");
    }

    if (isSpaceJustPressed || isEnterJustPressed || isEscapeJustPressed) {
      this.scene.start("MenuScene");
    }
  }
}
