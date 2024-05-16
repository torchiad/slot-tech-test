import * as PIXI from "pixi.js";
import { renderer } from "../renderer.js";
import { timerManager } from "../utils/timerManager.js";
import { soundManager } from "../soundManager.js";

/**
 * Evaluates the win conditions on a set of reels and manages the display of winnings.
 * This class uses PIXI.js to manage graphical representations of winnings.
 *
 * @class
 */
export class WinEvaluator {
    /**
     * Constructs the WinEvaluator.
     * @param {Object} reelManager - The reel manager that controls the slot machine reels.
     * @throws {TypeError} If the provided reelManager is not valid.
     */
    constructor(reelManager) {
        if (!reelManager || typeof reelManager !== "object") {
            throw new TypeError("Invalid reelManager provided.");
        }
        this.reelManager = reelManager;
        this.totalWinnings = 0;
        try {
            soundManager.loadSound("win", "./resource/audio/win.wav");
        } catch (error) {
            console.error("Failed to load sound: ", error);
        }
        this.setupWinningsDisplay();
    }

    /**
     * Sets up the visual display for the total winnings on the screen.
     */
    setupWinningsDisplay() {
        this._native = new PIXI.Container();
        this._native.x = 0;
        this._native.y = 300;
        this._native.visible = false;

        const greenPanel = PIXI.Sprite.from("greenPanel");
        greenPanel.width = 280;
        greenPanel.height = 100;

        this.winningsDisplay = new PIXI.Text("Total Winnings: $0", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0xffffff,
            align: "center",
        });

        this.winningsDisplay.anchor.set(0.5, 0.5);
        this.winningsDisplay.position.set(
            greenPanel.width / 2,
            greenPanel.height / 2
        );

        this._native.addChild(greenPanel);
        this._native.addChild(this.winningsDisplay);

        try {
            renderer.addChild(this._native);
        } catch (error) {
            console.error(
                "Failed to add winnings display to renderer: ",
                error
            );
        }
    }

    /**
     * Updates the display with the current total winnings.
     */
    updateWinningsDisplay() {
        this._native.visible = true;
        this.winningsDisplay.text = `Total Winnings: £${this.totalWinnings}`;
    }

    /**
     * Hides and resets the winnings display.
     */
    removeWinningsDisplay() {
        if (this.winningsDisplay) {
            this._native.visible = false;
            this.winningsDisplay.text = "Total Winnings: £0"; // Reset text
            this.totalWinnings = 0; // Reset total winnings
        }
    }

    /**
     * Evaluates the lines of reels for winning combinations.
     * @param {Array} reels - The reels to evaluate. Expected to be an array of objects.
     * @returns {number} The total winnings calculated.
     * @throws {Error} If the evaluation fails due to invalid reel data.
     */
    async evaluateWinLines(reels) {
        if (!Array.isArray(reels)) {
            throw new Error("Invalid reels data provided for evaluation.");
        }
        try {
            //we want to remove the first and last symbol from each reel
            //as they are not part of the win zone
            //@todo this is limiting to 3 row slots. This should be dynamic
            //length based on the number of symbols per reel
            const winZoneSymbolsArrays = reels.map((reel) =>
                reel._symbols.slice(1, 4)
            );

            //check each row on the reels for a win
            //@todo change from 3 to the reels length
            for (let i = 0; i < 3; i++) {
                if (
                    winZoneSymbolsArrays.every(
                        (symbols) =>
                            symbols[i]._name ===
                            winZoneSymbolsArrays[0][i]._name
                    )
                ) {
                    const totalValue = winZoneSymbolsArrays.reduce(
                        (acc, symbolsArray) =>
                            acc +
                            symbolsArray.reduce(
                                (sum, symbol) => sum + symbol._value,
                                0
                            ),
                        0
                    );
                    this.totalWinnings += totalValue;
                    this.updateWinningsDisplay();
                    soundManager.playSound("win");
                    await this.highlightWinLine(i);
                } else {
                    console.log(`No win at position ${i + 1}.`);
                }
            }
            return this.totalWinnings;
        } catch (error) {
            console.error("Failed to evaluate win lines: ", error);
            throw new Error("Error during the evaluation of win lines.");
        }
    }

    /**
     * Highlights the winning line on the reels for 2 seconds.
     * @param {number} rowIndex - The row index of the winning line.
     * @throws {Error} If unable to highlight due to graphical issues.
     */
    async highlightWinLine(rowIndex) {
        try {
            const line = new PIXI.Graphics();
            line.lineStyle(10, 0xff0000, 1);
            //@todo 20 aligns it but makes it less dynamic
            const startX = this.reelManager._reels[0].x + 20;
            const endX =
                this.reelManager._reels[this.reelManager._reels.length - 1].x +
                this.reelManager._reelWidth;
            const yOffset = this.reelManager._reels[0].y;
            const symbolRelativeY =
                this.reelManager._reels[0]._symbols[rowIndex + 1].y;
            //@todo 26 aligns it but makes it less dynamic
            const yPosition =
                yOffset + symbolRelativeY + this.reelManager._symbolHeight - 26;

            line.moveTo(startX, yPosition);
            line.lineTo(endX, yPosition);
            this.reelManager._native.addChild(line);

            await timerManager.startTimer(2000);

            this.reelManager._native.removeChild(line);
        } catch (error) {
            console.error("Failed to highlight winning line: ", error);
            throw new Error(
                "Graphical error in highlighting the winning line."
            );
        }
    }
}
