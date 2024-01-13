import * as Phaser from "phaser";
import BaseScene from "./BaseScene";

export default class ScoreScene extends BaseScene {
  private bestScore: number = isNaN(
    parseInt(localStorage.getItem("bestScore") || "", 10)
  )
    ? 0
    : parseInt(localStorage.getItem("bestScore") || "", 10);
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super("ScoreScene");
  }

  create() {
    super.createBackground();

    this.scoreText = this.add
      .text(400, 300, `Best score: ${this.bestScore}`, {
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "50px",
        color: "#000",
      })
      .setOrigin(0.5, 0.5);
  }
}
