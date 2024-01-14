import * as Phaser from "phaser";
import BaseScene from "./BaseScene";

export default class MenuScene extends BaseScene {
  private selectedItemIndex: number = 0;
  private menuItems: Phaser.GameObjects.Text[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private isEnterJustPressed: boolean = false;
  private introMusic!: Phaser.Sound.BaseSound;

  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("logo", "assets/logo.png");
    this.load.audio("intro", "assets/intro.mp3");
  }

  create() {
    super.createBackground();
    this.introMusic = this.sound.add("intro", { loop: true });

    this.add
      .image(Number(this.game.config.width) / 2, 135, "logo")
      .setScale(0.4);

    this.createMenuItem(Number(this.game.config.width) / 2, 275, "Play", () => {
      this.resetSceneData();
      this.scene.start("PlayScene");
    });
    this.createMenuItem(
      Number(this.game.config.width) / 2,
      325,
      "Score",
      () => {
        this.resetSceneData();
        this.scene.start("ScoreScene");
      }
    );
    this.createMenuItem(
      Number(this.game.config.width) / 2,
      375,
      "Controls",
      () => {
        this.resetSceneData();
        this.scene.start("ControlsScene");
      }
    );
    if (this._isSoundOn) {
      this.createMenuItem(
        Number(this.game.config.width) / 2,
        425,
        "Sound: ON",
        () => this.toggleSound()
      );
    } else {
      this.createMenuItem(
        Number(this.game.config.width) / 2,
        425,
        "Sound: OFF",
        () => this.toggleSound()
      );
    }
    this.createMenuItem(
      Number(this.game.config.width) / 2,
      475,
      "Credits",
      () => {
        this.resetSceneData();
        this.scene.start("CreditsScene");
      }
    );
    this.createMenuItem(Number(this.game.config.width) / 2, 525, "Exit", () =>
      this.handleExitButtonClick()
    );

    this.selectMenuItem(this.selectedItemIndex);
  }

  update() {
    if (this.input && this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.isEnterJustPressed = Phaser.Input.Keyboard.JustDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      );
    } else {
      console.error("Input or keyboard is not available");
    }
    const isDownJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
    const isUpJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    const isSpaceJustPressed = Phaser.Input.Keyboard.JustDown(
      this.cursors.space
    );

    if (isDownJustPressed) {
      this.selectedItemIndex = Phaser.Math.Wrap(
        this.selectedItemIndex + 1,
        0,
        this.menuItems.length
      );
      this.selectMenuItem(this.selectedItemIndex);
    } else if (isUpJustPressed) {
      this.selectedItemIndex = Phaser.Math.Wrap(
        this.selectedItemIndex - 1,
        0,
        this.menuItems.length
      );
      this.selectMenuItem(this.selectedItemIndex);
    }

    if (isSpaceJustPressed || this.isEnterJustPressed) {
      const selectedItem = this.menuItems[this.selectedItemIndex];
      selectedItem.emit("pointerdown");
    }
  }

  resetSceneData() {
    this.selectedItemIndex = 0;
    this.menuItems = [];
    this.isEnterJustPressed = false;
  }

  selectMenuItem(index: number) {
    this.menuItems.forEach((item, i) => {
      if (i === index) {
        item.setColor("#FF004D");
      } else {
        item.setColor("#000000");
      }
    });
  }

  createMenuItem(x: number, y: number, text: string, callback: () => void) {
    const menuItem = this.add
      .text(x, y, text, {
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "34px",
        color: "#000",
      })
      .setOrigin(0.5)
      .setInteractive();

    this.menuItems.push(menuItem);

    menuItem.on("pointerover", () => {
      this.selectedItemIndex = this.menuItems.indexOf(menuItem);
      this.selectMenuItem(this.selectedItemIndex);
    });

    menuItem.on("pointerdown", () => {
      callback();
    });

    return menuItem;
  }

  handleExitButtonClick() {
    const isExitConfirmed = window.confirm(
      "Are you sure you want to exit the game?"
    );
    if (isExitConfirmed) {
      this.game.destroy(true);
    }
  }

  toggleSound = () => {
    this._isSoundOn = !this._isSoundOn;

    const soundMenuItem = this.menuItems.find(
      (item) => item.text === "Sound: ON" || item.text === "Sound: OFF"
    );

    if (soundMenuItem) {
      soundMenuItem.text = this._isSoundOn ? "Sound: ON" : "Sound: OFF";
    }

    if (this._isSoundOn) {
      // Destroy all sounds except for this.introMusic
      if ((this.sound as any).sounds) {
        (this.sound as any).sounds.forEach((sound: Phaser.Sound.BaseSound) => {
          if (sound !== this.introMusic) {
            sound.destroy();
          }
        });
      }
      this.introMusic.play();
    } else {
      this.game.sound.stopAll();
    }
  };
}
