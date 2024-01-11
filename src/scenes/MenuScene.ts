import * as Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  private selectedItemIndex: number = 0;
  private menuItems: Phaser.GameObjects.Text[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private isEnterJustPressed: boolean = false;

  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
  }

  create() {
    this.add.image(400, 300, "sky");

    this.createMenuItem(400, 250, "Play", () => this.scene.start("PlayScene"));
    this.createMenuItem(400, 300, "Score", () => console.log("Score"));
    this.createMenuItem(400, 350, "Exit", () => console.log("Exit"));

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

  selectMenuItem(index: number) {
    this.menuItems.forEach((item, i) => {
      if (i === index) {
        item.setColor("#ff0000");
      } else {
        item.setColor("#000000");
      }
    });
  }

  createMenuItem(x: number, y: number, text: string, callback: () => void) {
    const menuItem = this.add
      .text(x, y, text, {
        fontSize: "32px",
        color: "#000000",
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
