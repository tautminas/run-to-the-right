import * as Phaser from "phaser";
import config from "./config";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";

new Phaser.Game(
  Object.assign(config, {
    scene: [MenuScene, PlayScene],
  })
);
