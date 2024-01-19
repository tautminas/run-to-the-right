import * as Phaser from "phaser";
import BaseScene from "./BaseScene";

export default class PauseScene extends BaseScene {
  private selectedItemIndex: number = 0;
  private menuItems: Phaser.GameObjects.Text[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private isEnterJustPressed: boolean = false;
  private introMusic!: Phaser.Sound.BaseSound;

  constructor() {
    super("PauseScene");
  }

  preload() {
    this.load.audio("intro", "assets/intro.mp3");
    this.introMusic = this.sound.add("intro", { loop: true });
  }

  create() {
    super.createBackground();
    this.createMenuItems();
  }

  update() {
    this.setupKeyboardControls();
  }

  createMenuItems() {
    this.createMenuItem(
      Number(this.game.config.width) / 2,
      275,
      "Continue",
      () => {
        this.resetSceneData();
        this.continueGame();
      }
    );
    this.createMenuItem(Number(this.game.config.width) / 2, 325, "Exit", () => {
      if (BaseScene._isSoundOn) {
        if ((this.sound as any).sounds) {
          (this.sound as any).sounds.forEach(
            (sound: Phaser.Sound.BaseSound) => {
              if (sound !== this.introMusic) {
                sound.destroy();
              }
            }
          );
        }
        this.introMusic.play();
      }
      this.resetSceneData();
      this.exitGame();
    });

    this.selectMenuItem(this.selectedItemIndex);
  }

  setupKeyboardControls() {
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

  continueGame() {
    this.scene.stop();
    this.scene.resume("PlayScene");
  }

  exitGame() {
    this.scene.stop("PlayScene");
    this.scene.start("MenuScene");
  }
}
