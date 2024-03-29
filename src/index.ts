import * as Phaser from "phaser";
import config from "./config";
import BaseScene from "./scenes/BaseScene";
import MenuScene from "./scenes/MenuScene";
import PlayScene from "./scenes/PlayScene";
import ScoreScene from "./scenes/ScoreScene";
import ControlsScene from "./scenes/ControlsScene";
import CreditsScene from "./scenes/CreditsScene";
import PauseScene from "./scenes/PauseScene";
import GameOverScene from "./scenes/GameOverScene";

new Phaser.Game(
  Object.assign(config, {
    scene: [
      BaseScene,
      MenuScene,
      PlayScene,
      ScoreScene,
      ControlsScene,
      CreditsScene,
      PauseScene,
      GameOverScene,
    ],
  })
);
