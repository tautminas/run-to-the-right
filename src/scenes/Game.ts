import * as Phaser from "phaser";

export default class Demo extends Phaser.Scene {
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private stars!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private bombs!: Phaser.Physics.Arcade.Group;
  private gameOver: boolean = false;
  private mainPlatform!: Phaser.Physics.Arcade.Image;
  private backgroundImage!: Phaser.GameObjects.Image;

  constructor() {
    super("GameScene");
  }

  preload() {
    // Loading assets
    this.load.image("logo", "assets/phaser3-logo.png");
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("main-idle", "assets/main-idle.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
    this.load.spritesheet("main-run", "assets/main-run.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
    this.load.spritesheet("main-attack", "assets/main-attack.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
  }

  create() {
    // Remove the boundaries from the right side
    this.physics.world.setBounds(
      0,
      0,
      Number.POSITIVE_INFINITY,
      this.physics.world.bounds.height
    );

    // World building
    this.backgroundImage = this.add.image(400, 300, "sky");

    // The platforms
    this.platforms = this.physics.add.staticGroup();
    this.mainPlatform = this.platforms
      .create(400, 568, "ground")
      .setScale(2)
      .refreshBody();
    // this.platforms.create(400, 300, "ground");

    // The player
    this.player = this.physics.add.sprite(100, 450, "main-idle");
    this.player.setBodySize(30, 55);
    this.player.setOffset(85, 73);
    this.player.setScale(1.5);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("main-idle", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("main-run", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("main-attack", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
    });

    // Adding physics
    this.physics.add.collider(this.player, this.platforms);

    // Keyboard controls
    if (this.input && this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      console.error("Input or keyboard is not available");
    }

    // Collecting stars
    // this.stars = this.physics.add.group({
    //   key: "star",
    //   repeat: 11,
    //   setXY: { x: 12, y: 0, stepX: 70 },
    // });
    // this.stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
    //   if (
    //     child instanceof Phaser.Physics.Arcade.Sprite &&
    //     child.body instanceof Phaser.Physics.Arcade.Body
    //   ) {
    //     child.body.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    //   }
    //   return true;
    // });
    // this.physics.add.collider(this.stars, this.platforms);
    // this.physics.add.overlap(
    //   this.player,
    //   this.stars,
    //   (
    //     player: Phaser.Physics.Arcade.Sprite,
    //     star: Phaser.Physics.Arcade.Sprite
    //   ) => {
    //     this.collectStar(player, star);
    //   }
    // );

    // Scores and scoring
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      color: "#000",
    });

    // Bouncing bombs
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      undefined,
      this
    );

    this.isAttackPlaying = false;

    // const bomb = this.bombs.create(600, 400, "bomb");
    // bomb.setBounce(1);
    // bomb.setCollideWorldBounds(false);
    // bomb.setVelocity(Phaser.Math.Between(-250, -50), 20);

    // Attack on A keydown
    this.input.keyboard.on(
      "keydown-A",
      function (event) {
        if (!this.isAttackPlaying) {
          this.isAttackPlaying = true;

          this.player.anims
            .play("attack")
            .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
              this.isAttackPlaying = false;
            });
        }
      },
      this
    );
  }

  update() {
    if (!this.player || !this.cursors) return;

    // Move camera to the right
    const centerX = this.cameras.main.width / 2;
    const playerX = this.player.x;
    if (playerX > this.cameras.main.scrollX + centerX) {
      // Camera
      this.cameras.main.scrollX = playerX - centerX;
      // Background
      this.backgroundImage.x = playerX;
      // Platform
      this.mainPlatform.x = this.cameras.main.scrollX + centerX;
      this.mainPlatform.body.updateFromGameObject();
      this.platforms.children.iterate((child) => {
        if (child instanceof Phaser.Physics.Arcade.Image) {
          if (child !== this.mainPlatform) {
            if (child.body) {
              child.body.updateFromGameObject();
            }
          }
        }
      });
      // Score text
      this.scoreText.setPosition(this.cameras.main.scrollX + 16, 16);
      this.score = Math.round(this.cameras.main.scrollX / 10);
      this.scoreText.setText("Score: " + this.score);
    }

    this.bombs.children.iterate((child) => {
      if (child.x < this.cameras.main.scrollX) {
        child.x = this.cameras.main.scrollX + this.game.config.width;
      }
    });

    // Disallow player to move beyond left edge
    const leftEdge = this.cameras.main.scrollX;
    if (playerX < leftEdge) {
      this.player.x = leftEdge;
    }

    if (!this.isAttackPlaying) {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-190);
        this.player.setScale(
          -1 * Math.abs(this.player.scaleX),
          this.player.scaleY
        );
        this.player.setOffset(116, 73);
        this.player.anims.play("run", true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(190);
        this.player.setScale(1.5);
        this.player.setOffset(85, 73);
        this.player.anims.play("run", true);
      } else {
        this.player.setVelocityX(0);
        this.player.setScale(1.5);
        this.player.setOffset(85, 73);
        this.player.anims.play("idle", true);
      }

      if (this.cursors.up?.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
      }
    }
  }

  collectStar(
    player: Phaser.Physics.Arcade.Sprite,
    star: Phaser.Physics.Arcade.Image
  ) {
    star.disableBody(true, true);

    this.scoreText.setText("Score: " + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        if (child instanceof Phaser.Physics.Arcade.Sprite) {
          child.enableBody(true, child.x, 0, true, true);
        }
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);

      var bomb = this.bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  hitBomb(
    player: Phaser.Physics.Arcade.Sprite,
    bomb: Phaser.Physics.Arcade.Sprite
  ) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    this.gameOver = true;
  }
}
