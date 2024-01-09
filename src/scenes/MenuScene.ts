import * as Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
  }

  create() {
    this.add.image(400, 300, "sky");
    // this.scene.start("PlayScene");
  }

  update() {}
}
