import * as PIXI from "pixi.js";
import { renderer } from "../renderer.js";
import { Button } from "../button.js";
import { timerManager } from "../utils/timerManager.js";
import { soundManager } from "../soundManager.js";

/**
 * SpinButton class for handling the spin button's functionality in a slot machine game.
 *
 * @class
 */
export class SpinButton {
  /**
   * Constructs the SpinButton.
   *
   * @param {Object} playerBalance - An object containing the player's balance and methods to manipulate it.
   * @param {Object} reelManager - The reel manager which controls the spinning of the reels.
   */
  constructor(playerBalance, reelManager) {
    this.reelManager = reelManager;
    this.playerBalance = playerBalance;
    this._create();
  }

  /**
   * Private method to create the spin button and set up its functionality.
   * @private
   */
  _create() {
    const button = new Button("playActive", async () => {
      soundManager.loadSound("click", "./resource/audio/click.wav");
      if (this.reelManager._spinning) {
        console.log("cannot spin when spinning");
        return;
      }
      if (!this.playerBalance.deductBet()) {
        console.log("Insufficient balance to place bet");
        return;
      }

      button.native.texture = PIXI.Texture.from("playNonactive");
      soundManager.playSound("click");
      this.reelManager.startSpin();
      await timerManager.startTimer(2000);
      const winnings = await this.reelManager.stopSpin();
      console.log(winnings);
      this.playerBalance.addWinnings(winnings);
      button.native.texture = PIXI.Texture.from("playActive");
    });
    button.x = 475;
    button.y = 440;
    renderer.addChild(button.native);
  }
}
