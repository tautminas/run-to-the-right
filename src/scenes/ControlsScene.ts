import * as Phaser from "phaser";
import BaseScene from "./BaseScene";

export default class ScoreScene extends BaseScene {
  constructor() {
    super("ControlsScene");
  }

  create() {
    super.createBackground();
    this.createControlsText();
    super.createBackBtnForInfoScene();
  }

  createControlsText() {
    const bestScore = isNaN(
      parseInt(localStorage.getItem("bestScore") || "", 10)
    )
      ? 0
      : parseInt(localStorage.getItem("bestScore") || "", 10);

    this.add
      .text(
        Number(this.game.config.width) / 2,
        Number(this.game.config.height) / 2,
        "Attack: A\nJump: ↑\nLeft: ←\nRight: →",
        {
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "44px",
          color: "#000",
        }
      )
      .setOrigin(0.5, 0.5);
  }
}
