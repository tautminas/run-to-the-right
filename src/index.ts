import * as Phaser from "phaser";
import config from "./config";
import BaseScene from "./scenes/BaseScene";
import MenuScene from "./scenes/MenuScene";
import PlayScene from "./scenes/PlayScene";
import ScoreScene from "./scenes/ScoreScene";

new Phaser.Game(
  Object.assign(config, {
    scene: [BaseScene, MenuScene, PlayScene, ScoreScene],
  })
);
