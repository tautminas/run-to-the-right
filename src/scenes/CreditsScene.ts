import BaseScene from "./BaseScene";

export default class CreditsScene extends BaseScene {
  constructor() {
    super("CreditsScene");
  }

  create() {
    super.createBackground();
    this.createCreditsTexts();
    super.createBackBtnForInfoScene();
  }

  update() {
    super.handleBackToMenuFromInfo();
  }

  createCreditsTexts() {
    this.add
      .text(
        Number(this.game.config.width) / 2,
        Number(this.game.config.height) / 2 - 100,
        "THANK YOU FOR PLAYING!",
        {
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "40px",
          color: "#000",
        }
      )
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        Number(this.game.config.width) / 2,
        Number(this.game.config.height) / 2 - 50,
        "Game creation and programming: Tautminas Cibulskis",
        {
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "24px",
          color: "#000",
        }
      )
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        Number(this.game.config.width) / 2,
        Number(this.game.config.height) / 2,
        "Music: Julijona Biveinytė",
        {
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "24px",
          color: "#000",
        }
      )
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        Number(this.game.config.width) / 2,
        Number(this.game.config.height) / 2 + 75,
        "Image assets were taken from:\n• Free itch.io sources (LuizMelo, brullov)\n• Educational courses on Phaser (phaser.io, Filip Jerga, Ansimuz)\n• Image generator (runwayml.com)\n• Logo maker (Adobe Express)",
        {
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "18px",
          color: "#000",
        }
      )
      .setOrigin(0.5, 0.5);
    this.add
      .text(
        Number(this.game.config.width) / 2,
        Number(this.game.config.height) / 2 + 145,
        "I respect others' licenses. Large quantity of sources, offchance of oversight. If any issues arise, please contact me to resolve.",
        {
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "10px",
          color: "#000",
        }
      )
      .setOrigin(0.5, 0.5);
  }
}
