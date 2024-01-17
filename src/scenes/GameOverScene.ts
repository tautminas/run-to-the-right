import * as Phaser from "phaser";
import BaseScene from "./BaseScene";
import PlayScene from "./PlayScene";

export default class GameOverScene extends BaseScene {
  private restartText!: Phaser.GameObjects.Text;
  private isEnterJustPressed: boolean = false;
  private isEscapeJustPressed: boolean = false;

  constructor() {
    super("GameOverScene");
  }

  create() {
    this.createGameOverInfoTexts();
  }

  update() {
    if (this.input && this.input.keyboard) {
      this.isEnterJustPressed = Phaser.Input.Keyboard.JustDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      );
      this.isEscapeJustPressed = Phaser.Input.Keyboard.JustDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      );
    } else {
      console.error("Input or keyboard is not available");
    }

    if (this.isEnterJustPressed) {
      this.scene.stop();
      const playScene = this.scene.get("PlayScene") as PlayScene;
      if (playScene) {
        playScene.resetScene();
      }
    }

    if (this.isEscapeJustPressed) {
      console.log("Esc");
    }
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
