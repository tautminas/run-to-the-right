import * as Phaser from "phaser";
import BaseScene from "./BaseScene";

export default class GameOverScene extends BaseScene {
  private restartText!: Phaser.GameObjects.Text;

  constructor() {
    super("GameOverScene");
  }

  create() {
    this.createGameOverInfoTexts();
  }

  createGameOverInfoTexts() {
    this.add
      .text(400, 120, "GAME OVER!", {
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "66px",
        color: "#000",
      })
      .setOrigin(0.5);

    this.restartText = this.add
      .text(400, 325, "Ready to Restart? Press Enter!", {
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "36px",
        color: "#000",
      })
      .setOrigin(0.5);

    this.restartText.setAlpha(0);

    this.tweens.add({
      targets: this.restartText,
      duration: 800,
      repeat: -1,
      yoyo: true,
      alpha: {
        from: 0,
        to: 1,
      },
    });

    this.add
      .text(400, 480, "Want to Exit? Press Esc", {
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "20px",
        color: "#000",
      })
      .setOrigin(0.5);
  }
}
