import * as PIXI from "pixi.js";
import { renderer } from "../renderer.js";
import { Tween } from "../utils/tween.js";

/**
 * Scenery class responsible for managing and animating clouds within the game environment.
 *
 * @class
 */
export class Scenery {
  /**
   * Creates an instance of Scenery.
   */
  constructor() {
    this._create();
  }

  /**
   * Private method to create initial clouds and animate them.
   * @private
   */
  _create() {
    const cloud1 = this.createCloud("cloud1", -200, 10);
    const cloud2 = this.createCloud("cloud2", 200, 0);

    this.animateCloud(cloud1, 30000, -200);
    this.animateCloud(cloud2, 35000, -250);
  }

  /**
   * Creates a cloud sprite with a given texture ID and initial position.
   *
   * @param {string} textureId - The ID of the texture to use for the cloud sprite.
   * @param {number} startX - The initial x-coordinate of the cloud.
   * @param {number} startY - The initial y-coordinate of the cloud.
   * @returns {PIXI.Sprite} The created cloud sprite.
   */
  createCloud(textureId, startX, startY) {
    const cloud = PIXI.Sprite.from(textureId);
    cloud.x = startX;
    cloud.y = startY;
    renderer.addChild(cloud);
    return cloud;
  }

  /**
   * Animates a cloud moving across the renderer's width and then resets its position.
   *
   * @param {PIXI.Sprite} cloud - The cloud sprite to animate.
   */
  animateCloud(cloud, travelTime = 15000, startX = -200) {
    const resetAndAnimate = () => {
      cloud.x = startX;
      const toVars = {
        x: 1000, //renderer._innerWidth + cloud.width,
        ease: "none",
        onComplete: resetAndAnimate, // Recursion to loop the animation
      };
      Tween.to(cloud, travelTime, toVars);
    };

    resetAndAnimate();
  }
}
