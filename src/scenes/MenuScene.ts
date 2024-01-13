import * as Phaser from "phaser";
import BaseScene from "./BaseScene";

export default class MenuScene extends BaseScene {
  private selectedItemIndex: number = 0;
  private menuItems: Phaser.GameObjects.Text[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private isEnterJustPressed: boolean = false;

  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("logo", "assets/logo.png");
  }

  create() {
    super.createBackground();
    this.add.image(400, 135, "logo").setScale(0.4);

    this.createMenuItem(400, 275, "Play", () => {
      this.resetSceneData();
      this.scene.start("PlayScene");
    });
    this.createMenuItem(400, 325, "Score", () => {
      this.resetSceneData();
      this.scene.start("ScoreScene");
    });
    this.createMenuItem(400, 375, "Controls", () => {
      this.resetSceneData();
      this.scene.start("ControlsScene");
    });
    this.createMenuItem(400, 425, "Sound: ON", () => console.log("Sound: ON"));
    this.createMenuItem(400, 475, "Credits", () => console.log("Credits"));
    this.createMenuItem(400, 525, "Exit", () => console.log("Exit"));

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
}
