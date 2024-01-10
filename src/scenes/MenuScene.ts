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

    const playText = this.add
      .text(400, 250, "Play", {
        fontSize: "32px",
        color: "#000000",
      })
      .setOrigin(0.5);
    playText.setInteractive();
    playText.on("pointerdown", () => this.scene.start("PlayScene"));

    const scoreText = this.add
      .text(400, 300, "Score", {
        fontSize: "32px",
        color: "#000000",
      })
      .setOrigin(0.5);
    scoreText.setInteractive();
    scoreText.on("pointerdown", () => console.log("Score"));

    const exitText = this.add
      .text(400, 350, "Exit", {
        fontSize: "32px",
        color: "#000000",
      })
      .setOrigin(0.5);
    exitText.setInteractive();
    exitText.on("pointerdown", () => console.log("Exit"));
  }

  update() {}
}
