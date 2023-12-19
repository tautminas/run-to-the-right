import * as Phaser from "phaser";

export default class Demo extends Phaser.Scene {
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private stars!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private bombs!: Phaser.Physics.Arcade.Group;
  private flyingEyeMonsters!: Phaser.Physics.Arcade.Group;
  private mainPlatform!: Phaser.Physics.Arcade.Image;
  private backgroundImage!: Phaser.GameObjects.Image;
  private gameOver: boolean = false;
  private isAttackPlaying: boolean = false;
  private isRightKeyDown: boolean = false;
  private isLeftKeyDown: boolean = false;

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
    this.load.spritesheet("main-jump", "assets/main-jump.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
    this.load.spritesheet("main-fall", "assets/main-fall.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
    this.load.spritesheet("main-death", "assets/main-death.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
    this.load.spritesheet("explosion", "assets/explosion.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet(
      "eye-monster-flight",
      "assets/eye-monster-flight.png",
      {
        frameWidth: 150,
        frameHeight: 150,
      }
    );
    this.load.spritesheet(
      "eye-monster-attack",
      "assets/eye-monster-attack.png",
      {
        frameWidth: 150,
        frameHeight: 150,
      }
    );
    this.load.spritesheet("eye-monster-death", "assets/eye-monster-death.png", {
      frameWidth: 150,
      frameHeight: 150,
    });
  }

  create() {
    // Set gravity
    this.physics.world.gravity.y = 900;

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
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("main-jump", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "fall",
      frames: this.anims.generateFrameNumbers("main-fall", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "death",
      frames: this.anims.generateFrameNumbers("main-death", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "explosion",
      frames: this.anims.generateFrameNumbers("explosion", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "eye-monster-flight",
      frames: this.anims.generateFrameNumbers("eye-monster-flight", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
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

    // Bombs
    // const bomb = this.bombs.create(600, 400, "bomb");
    // bomb.setBounce(1);
    // bomb.setCollideWorldBounds(false);
    // bomb.setVelocity(Phaser.Math.Between(-250, -50), 20);

    // Flying eye monsters
    // const flyingEyeMonster = this.physics.add.sprite(
    //   600,
    //   450,
    //   "eye-monster-flight"
    // );
    // flyingEyeMonster.setBodySize(45, 45);
    // flyingEyeMonster.setOffset(100, 60);
    // flyingEyeMonster.setScale(-1.5, 1.5);
    // flyingEyeMonster.setBounce(0.2);
    // flyingEyeMonster.setCollideWorldBounds(true);
    // flyingEyeMonster.anims.play("eye-monster-flight");
    // this.physics.add.collider(this.platforms, flyingEyeMonster);

    // Attack on A keydown
    this.input.keyboard?.on("keydown-A", (event: KeyboardEvent) => {
      if (this.player.body.onFloor()) {
        this.player.setVelocityX(0);
      }
      if (!this.isAttackPlaying) {
        this.isAttackPlaying = true;
        this.player.anims
          .play("attack")
          .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.isAttackPlaying = false;
            if (this.isRightKeyDown) {
              this.player.setVelocityX(190);
              this.player.setScale(1.5);
              this.player.setOffset(85, 73);
            } else if (this.isLeftKeyDown) {
              this.player.setVelocityX(-190);
              this.player.setScale(
                -1 * Math.abs(this.player.scaleX),
                this.player.scaleY
              );
              this.player.setOffset(116, 73);
            }
          });
      }
    });

    this.input.keyboard?.on("keydown-LEFT", (event: KeyboardEvent) => {
      this.isLeftKeyDown = true;
      this.player.setVelocityX(-190);
      this.player.setScale(
        -1 * Math.abs(this.player.scaleX),
        this.player.scaleY
      );
      this.player.setOffset(116, 73);
    });

    this.input.keyboard?.on("keyup-LEFT", () => {
      this.isLeftKeyDown = false;
    });

    this.input.keyboard?.on("keydown-RIGHT", (event: KeyboardEvent) => {
      this.isRightKeyDown = true;
      this.player.setVelocityX(190);
      this.player.setScale(1.5);
      this.player.setOffset(85, 73);
    });

    this.input.keyboard?.on("keyup-RIGHT", () => {
      this.isRightKeyDown = false;
    });
  }

  update() {
    if (!this.player || !this.cursors || this.gameOver) return;

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
      if (this.mainPlatform && this.mainPlatform.body) {
        this.mainPlatform.body.updateFromGameObject();
      }
      this.platforms.children.iterate(
        (child: Phaser.GameObjects.GameObject) => {
          if (child instanceof Phaser.Physics.Arcade.Image) {
            if (child !== this.mainPlatform) {
              if (child.body) {
                child.body.updateFromGameObject();
              }
            }
          }
          return true;
        }
      );
      // Score text
      this.scoreText.setPosition(this.cameras.main.scrollX + 16, 16);
      this.score = Math.round(this.cameras.main.scrollX / 10);
      this.scoreText.setText("Score: " + this.score);
    }

    this.bombs.children.iterate((child: Phaser.GameObjects.GameObject) => {
      if (child instanceof Phaser.Physics.Arcade.Sprite) {
        if (typeof this.game.config.width === "number") {
          if (child.x < this.cameras.main.scrollX) {
            child.x =
              this.cameras.main.scrollX + Number(this.game.config.width);
          }
        }
      }
      return true;
    });

    // Disallow player to move beyond left edge
    const leftEdge = this.cameras.main.scrollX;
    if (playerX < leftEdge) {
      this.player.x = leftEdge;
    }

    if (!this.isAttackPlaying) {
      if (!this.player.body.touching.down) {
        if (this.player.body.velocity.y < 0) {
          this.player.anims.play("jump", true);
        } else {
          this.player.anims.play("fall", true);
        }
      } else if (this.cursors.left.isDown || this.cursors.right.isDown) {
        this.player.anims.play("run", true);
      } else {
        this.player.setVelocityX(0);
        this.player.setScale(1.5);
        this.player.setOffset(85, 73);
        this.player.anims.play("idle", true);
      }

      if (this.cursors.up?.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-550);
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
      this.stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
        if (child instanceof Phaser.Physics.Arcade.Sprite) {
          child.enableBody(true, child.x, 0, true, true);
        }
        return true;
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
    player:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    bomb: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    const playerSprite = player as Phaser.Physics.Arcade.Sprite;
    const bombSprite = bomb as Phaser.Physics.Arcade.Sprite;
    bombSprite.anims
      .play("explosion")
      .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        bomb.destroy();
      });
    playerSprite.anims.play("death");
    playerSprite.setVelocityX(0);
    playerSprite.setVelocityY(130);
    this.physics.resume();
    this.gameOver = true;
  }
}
