import * as Phaser from "phaser";

export default class Demo extends Phaser.Scene {
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private scoreText!: Phaser.GameObjects.Text;
  private bombs!: Phaser.Physics.Arcade.Group;
  private flyingEyeMonsters!: Phaser.Physics.Arcade.Group;
  private ground!: Phaser.Physics.Arcade.Image;
  private backgroundImage!: Phaser.GameObjects.Image;
  private gameOver: boolean = false;
  private isAttackPlaying: boolean = false;
  private isRightKeyDown: boolean = false;
  private isLeftKeyDown: boolean = false;
  private rightMostPlatformX: number = 0;
  private score: number = 0;
  private bombTimer!: Phaser.Time.TimerEvent;
  private flyingEyeMonsterTimer!: Phaser.Time.TimerEvent;
  private bombInterval: number = 600_000;
  private flyingEyeMonsterInterval: number = 600_000;
  private eyeMonstersCollider!: Phaser.Physics.Arcade.Collider;
  private bombsCollider!: Phaser.Physics.Arcade.Collider;
  private attackHitbox: Phaser.Physics.Arcade.Sprite | null = null;
  private attackCollider: Phaser.Physics.Arcade.Collider | null = null;

  private skeletons!: Phaser.Physics.Arcade.Group;
  private skeletonsInterval: number = 3_000;
  private skeletonTimer!: Phaser.Time.TimerEvent;
  // private skeletonsCollider!: Phaser.Physics.Arcade.Collider;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.preloadAssets();
  }

  create() {
    this.setPhysics();
    this.createWorld();
    this.createPlayer();
    this.createPlatforms();
    this.createBombs();
    this.createSkeletons();
    this.createScoreText();
    this.createFlyingEyeMonsters();
    this.createAnimations();
    this.setupKeyboardControls();
    this.setupPlayerActionKeyboardEvents();
    this.createColliders();
  }

  update() {
    if (!this.player || !this.cursors || this.gameOver) return;

    const isPlayerAttacking =
      this.player.anims.currentAnim?.key === "attack" &&
      this.player.anims.isPlaying;
    if (isPlayerAttacking) {
      if (!this.attackHitbox) {
        this.attackHitbox = this.physics.add
          .sprite(400, 400, "invisibleSprite")
          .setOrigin(0, 0.5);
        this.attackHitbox.setVisible(false);
        this.attackHitbox.setDisplaySize(100, 95);
        if (this.attackHitbox.body) {
          this.attackHitbox.body.setAllowGravity(false);
          this.attackHitbox.body.enable = true;
        }
      }
      if (this.player.scaleX > 0) {
        if (this.player.body.velocity.x !== 0) {
          this.attackHitbox.setPosition(this.player.x + 30, this.player.y);
        } else {
          this.attackHitbox.setPosition(this.player.x + 24, this.player.y);
        }
      } else {
        if (this.player.body.velocity.x !== 0) {
          this.attackHitbox.setPosition(this.player.x - 130, this.player.y);
        } else {
          this.attackHitbox.setPosition(this.player.x - 124, this.player.y);
        }
      }
      this.attackCollider = this.physics.add.overlap(
        this.attackHitbox,
        this.flyingEyeMonsters,
        this.attackFlyingEyeMonster,
        undefined,
        this
      );
    } else {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
      if (this.attackCollider) {
        this.attackCollider = null;
      }
    }

    // Move camera to the right
    const centerX = this.cameras.main.width / 2;
    const playerX = this.player.x;
    if (playerX > this.cameras.main.scrollX + centerX) {
      // Camera
      this.cameras.main.scrollX = playerX - centerX;
      // Background
      this.backgroundImage.x = playerX;
      // Platform
      this.ground.x = this.cameras.main.scrollX + centerX;
      if (this.ground && this.ground.body) {
        this.ground.body.updateFromGameObject();
      }
      // Score text
      this.scoreText.setPosition(this.cameras.main.scrollX + 16, 16);
      this.score = Math.round(this.cameras.main.scrollX / 10);
      this.scoreText.setText("Score: " + this.score);
    }

    this.platforms
      .getChildren()
      .forEach((platform: Phaser.GameObjects.GameObject) => {
        const platformSprite = platform as Phaser.Physics.Arcade.Sprite;

        const platformRightX = platformSprite.x + platformSprite.displayWidth;

        if (platformRightX > this.rightMostPlatformX) {
          this.rightMostPlatformX = platformRightX;
        }

        if (platformRightX < this.cameras.main.scrollX) {
          platform.destroy();
        }
      });

    const screenThresholdX =
      this.cameras.main.scrollX + this.cameras.main.width * 0.8;
    if (this.rightMostPlatformX < screenThresholdX) {
      const platformCreationActions = [
        () => {
          this.platforms
            .create(
              this.cameras.main.scrollX + this.scale.width,
              400,
              "platform"
            )
            .setOrigin(0, 0.5)
            .refreshBody();
          this.platforms
            .create(
              this.cameras.main.scrollX + this.scale.width + 200,
              250,
              "platform"
            )
            .setOrigin(0, 0.5)
            .refreshBody();
        },
        () => {
          this.platforms
            .create(
              this.cameras.main.scrollX + this.scale.width + 200,
              400,
              "platform"
            )
            .setOrigin(0, 0.5)
            .refreshBody();
          this.platforms
            .create(
              this.cameras.main.scrollX + this.scale.width,
              250,
              "platform"
            )
            .setOrigin(0, 0.5)
            .refreshBody();
        },
        () => {
          this.platforms
            .create(
              this.cameras.main.scrollX + this.scale.width + 350,
              400,
              "platform"
            )
            .setOrigin(0, 0.5)
            .refreshBody();
          this.platforms
            .create(
              this.cameras.main.scrollX + this.scale.width,
              250,
              "platform"
            )
            .setOrigin(0, 0.5)
            .refreshBody();
          this.platforms
            .create(
              this.cameras.main.scrollX + this.scale.width + 700,
              250,
              "platform"
            )
            .setOrigin(0, 0.5)
            .refreshBody();
        },
        () => {
          this.platforms
            .create(
              this.cameras.main.scrollX + this.scale.width,
              397,
              "platform"
            )
            .setOrigin(0, 0.5)
            .refreshBody();
        },
      ];
      const randomIndex = Phaser.Math.RND.between(
        0,
        platformCreationActions.length - 1
      );
      const selectedAction = platformCreationActions[randomIndex];
      selectedAction();
    }

    this.bombs.children.iterate((child: Phaser.GameObjects.GameObject) => {
      if (child instanceof Phaser.Physics.Arcade.Sprite) {
        if (typeof this.game.config.width === "number") {
          if (
            child.x < this.cameras.main.scrollX ||
            child.x >
              this.cameras.main.scrollX + Number(this.game.config.width) + 50
          ) {
            child.destroy();
          }
        }
      }
      return true;
    });

    this.flyingEyeMonsters.children.iterate(
      (child: Phaser.GameObjects.GameObject) => {
        if (child instanceof Phaser.Physics.Arcade.Sprite) {
          if (typeof this.game.config.width === "number") {
            if (
              child.x < this.cameras.main.scrollX ||
              child.x >
                this.cameras.main.scrollX + Number(this.game.config.width) + 50
            ) {
              child.destroy();
            }
          }
        }
        return true;
      }
    );

    // Disallow player to move beyond left edge
    const leftEdge = this.cameras.main.scrollX;
    if (playerX < leftEdge) {
      this.player.x = leftEdge;
    }

    // Player animations
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

  preloadAssets() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("platform", "assets/platform.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("ground", "assets/ground.png");
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
    this.load.spritesheet("skeleton-walk", "assets/skeleton-walk.png", {
      frameWidth: 150,
      frameHeight: 150,
    });
    this.load.spritesheet("skeleton-attack", "assets/skeleton-attack.png", {
      frameWidth: 150,
      frameHeight: 150,
    });
    this.load.spritesheet("skeleton-death", "assets/skeleton-death.png", {
      frameWidth: 150,
      frameHeight: 150,
    });
  }

  setPhysics() {
    this.physics.world.gravity.y = 900;

    // Remove the boundaries from the right side
    this.physics.world.setBounds(
      0,
      0,
      Number.POSITIVE_INFINITY,
      this.physics.world.bounds.height
    );
  }

  createWorld() {
    this.backgroundImage = this.add.image(400, 300, "sky");
    this.ground = this.physics.add
      .staticSprite(this.scale.width * 0.5, this.scale.height, "ground")
      .setOrigin(0.5, 1)
      .refreshBody();
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 450, "main-idle");
    this.player.setBodySize(30, 55);
    this.player.setOffset(85, 73);
    this.player.setScale(1.5);
    this.player.setCollideWorldBounds(true);
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    const platformCreationActions = [
      () => {
        this.platforms
          .create(100, 400, "platform")
          .setOrigin(0, 0.5)
          .refreshBody();
        this.platforms
          .create(300, 250, "platform")
          .setOrigin(0, 0.5)
          .refreshBody();
      },
      () => {
        this.platforms
          .create(300, 400, "platform")
          .setOrigin(0, 0.5)
          .refreshBody();
        this.platforms
          .create(100, 250, "platform")
          .setOrigin(0, 0.5)
          .refreshBody();
      },
      () => {
        this.platforms
          .create(200, 400, "platform")
          .setOrigin(0, 0.5)
          .refreshBody();
        this.platforms
          .create(-150, 250, "platform")
          .setOrigin(0, 0.5)
          .refreshBody();
        this.platforms
          .create(550, 250, "platform")
          .setOrigin(0, 0.5)
          .refreshBody();
      },
      () => {
        this.platforms
          .create(200, 397, "platform")
          .setOrigin(0, 0.5)
          .refreshBody();
      },
    ];
    const randomIndex = Phaser.Math.RND.between(
      0,
      platformCreationActions.length - 1
    );
    const selectedAction = platformCreationActions[randomIndex];
    selectedAction();
  }

  createFlyingEyeMonsters() {
    this.flyingEyeMonsters = this.physics.add.group();
    this.startFlyingEyeMonsterSpawning();
  }

  createFlyingEyeMonster() {
    const flyingEyeMonster = this.flyingEyeMonsters.create(
      this.cameras.main.scrollX + Number(this.game.config.width) + 10,
      485,
      "eye-monster-flight"
    );
    flyingEyeMonster.setBodySize(45, 45);
    flyingEyeMonster.setOffset(100, 60);
    flyingEyeMonster.setScale(-1.5, 1.5);
    flyingEyeMonster.anims.play("eye-monster-flight");
    flyingEyeMonster.setVelocityX(-100);
  }

  startFlyingEyeMonsterSpawning() {
    this.flyingEyeMonsterTimer = this.time.addEvent({
      delay: this.flyingEyeMonsterInterval,
      callback: this.createFlyingEyeMonster,
      callbackScope: this,
      loop: true,
    });
  }

  stopFlyingEyeMonsterSpawning() {
    if (this.flyingEyeMonsterTimer) {
      this.flyingEyeMonsterTimer.destroy();
    }
  }

  createBombs() {
    this.bombs = this.physics.add.group();
    this.startBombSpawning();
  }

  createSkeleton() {
    const skeleton = this.skeletons.create(
      this.cameras.main.scrollX + Number(this.game.config.width) + 10,
      485,
      "skeleton-walk"
    );
    skeleton.setBodySize(45, 45);
    skeleton.setOffset(100, 60);
    skeleton.setScale(-1.5, 1.5);
    skeleton.anims.play("skeleton-walk");
    skeleton.setVelocityX(-100);
  }

  createScoreText() {
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      color: "#000",
    });
  }

  createColliders() {
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.bombs, this.ground);
    this.physics.add.collider(this.skeletons, this.ground);
    this.bombsCollider = this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      undefined,
      this
    );
    this.physics.add.collider(this.flyingEyeMonsters, this.ground);
    this.eyeMonstersCollider = this.physics.add.collider(
      this.player,
      this.flyingEyeMonsters,
      this.hitFlyingEyeMonster,
      undefined,
      this
    );
  }

  createAnimations() {
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("main-idle", {
        start: 0,
        end: 3,
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
    this.anims.create({
      key: "eye-monster-attack",
      frames: this.anims.generateFrameNumbers("eye-monster-attack", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "eye-monster-death",
      frames: this.anims.generateFrameNumbers("eye-monster-death", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
    });
    //
    this.anims.create({
      key: "skeleton-walk",
      frames: this.anims.generateFrameNumbers("skeleton-walk", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "skeleton-attack",
      frames: this.anims.generateFrameNumbers("skeleton-attack", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "skeleton-death",
      frames: this.anims.generateFrameNumbers("skeleton-death", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
    });
  }

  setupKeyboardControls() {
    if (this.input && this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      console.error("Input or keyboard is not available");
    }
  }

  setupPlayerActionKeyboardEvents() {
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

  createBomb() {
    const bomb = this.bombs.create(
      this.cameras.main.scrollX + Number(this.game.config.width) + 5,
      Phaser.Math.Between(50, Number(this.game.config.height) - 100),
      "bomb"
    );
    bomb.setBounce(1);
    bomb.setVelocity(
      Phaser.Math.Between(-400, -100),
      Phaser.Math.Between(-400, -100)
    );
  }

  startBombSpawning() {
    this.bombTimer = this.time.addEvent({
      delay: this.bombInterval,
      callback: this.createBomb,
      callbackScope: this,
      loop: true,
    });
  }

  stopBombSpawning() {
    if (this.bombTimer) {
      this.bombTimer.destroy();
    }
  }

  createSkeletons() {
    this.skeletons = this.physics.add.group();
    this.startSkeletonSpawning();
  }

  startSkeletonSpawning() {
    this.skeletonTimer = this.time.addEvent({
      delay: this.skeletonsInterval,
      callback: this.createSkeleton,
      callbackScope: this,
      loop: true,
    });
  }

  stopSkeletonSpawning() {
    if (this.skeletonTimer) {
      this.skeletonTimer.destroy();
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
    this.stopFlyingEyeMonsterSpawning();
    this.stopBombSpawning();
    this.bombsCollider.destroy();
    this.eyeMonstersCollider.destroy();
  }

  hitFlyingEyeMonster(
    player:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    flyingEyeMonster:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
  ) {
    const playerSprite = player as Phaser.Physics.Arcade.Sprite;
    const flyingEyeMonsterSprite =
      flyingEyeMonster as Phaser.Physics.Arcade.Sprite;
    playerSprite.anims.play("death");
    playerSprite.setVelocityX(0);
    playerSprite.setVelocityY(130);
    flyingEyeMonsterSprite.setVelocityX(-100);
    flyingEyeMonsterSprite.anims
      .play("eye-monster-attack")
      .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        flyingEyeMonster.play("eye-monster-flight");
      });
    this.physics.resume();
    this.gameOver = true;
    this.stopFlyingEyeMonsterSpawning();
    this.stopBombSpawning();
    this.bombsCollider.destroy();
    this.eyeMonstersCollider.destroy();
  }

  attackFlyingEyeMonster(
    attack:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    flyingEyeMonster:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
  ) {
    const attackSprite = attack as Phaser.Physics.Arcade.Sprite;
    const flyingEyeMonsterSprite =
      flyingEyeMonster as Phaser.Physics.Arcade.Sprite;
    this.flyingEyeMonsters.remove(flyingEyeMonsterSprite);
    this.physics.add.collider(this.ground, flyingEyeMonsterSprite);
    flyingEyeMonsterSprite.anims
      .play("eye-monster-death")
      .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        flyingEyeMonsterSprite.destroy();
      });
  }
}
