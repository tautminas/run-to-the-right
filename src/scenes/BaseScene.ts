import * as Phaser from "phaser";

export default class BaseScene extends Phaser.Scene {
  constructor(key: string) {
    super(key);
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
  }

  create() {
    this.scene.start("MenuScene");
  }

  createBackground() {
    this.add.image(400, 300, "sky").setScrollFactor(0);
  }
}
