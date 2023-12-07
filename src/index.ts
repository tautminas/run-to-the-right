import * as Phaser from "phaser";
import config from "./config";
import GameScene from "./scenes/Game";

new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene],
  })
);
