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
}
