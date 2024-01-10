import * as Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  private selectedItemIndex: number = 0;
  private menuItems: Phaser.GameObjects.Text[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

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

    this.menuItems = [playText, scoreText, exitText];
    this.selectMenuItem(this.selectedItemIndex);
  }

  update() {
    if (this.input && this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
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

    if (isSpaceJustPressed) {
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
}
