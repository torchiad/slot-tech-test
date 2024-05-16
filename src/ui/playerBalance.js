import * as PIXI from "pixi.js";
import { renderer } from "../renderer.js";

/**
 * Class representing a player's balance. Manages the display and update of the player's balance in a game.
 */
export class PlayerBalance {
    /**
     * Constructs a new instance of PlayerBalance.
     * @param {number} [initialBalance=0] - The initial balance of the player, defaults to 0.
     */
    constructor(initialBalance = 0) {
        if (
            typeof initialBalance !== "number" ||
            Number.isNaN(initialBalance)
        ) {
            throw new TypeError("Initial balance must be a valid number.");
        }
        this.balance = initialBalance;
        this._create();
    }

    /**
     * Initializes and displays the balance container and text.
     * This method is private and should not be called from outside this class.
     * @private
     * @throws {Error} If there's an error in creating PIXI elements.
     */
    _create() {
        this._native = new PIXI.Container();
        this._native.x = 0;
        this._native.y = 400;

        const backgroundImage = PIXI.Sprite.from("greenPanel");
        backgroundImage.width = 200;
        backgroundImage.height = 80;
        this._native.addChild(backgroundImage);

        this.balanceDisplay = new PIXI.Text(`Balance: £${this.balance}`, {
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0xffffff,
            align: "center",
        });

        this.balanceDisplay.x =
            backgroundImage.width / 2 - this.balanceDisplay.width / 2;
        this.balanceDisplay.y =
            backgroundImage.height / 2 - this.balanceDisplay.height / 2;

        this._native.addChild(this.balanceDisplay);
        renderer.addChild(this._native);

        this.updateBalanceDisplay();
    }

    /**
     * Updates the text display of the balance. Also refreshes the PIXI text to reflect changes.
     */
    updateBalanceDisplay() {
        this.balanceDisplay.text = `Balance: £${this.balance}`;
        this.balanceDisplay.updateText();
    }

    /**
     * Adds winnings to the player's balance and updates the display.
     * Logs the addition for debugging purposes.
     * @param {number} amount - The amount of winnings to add.
     */
    addWinnings(amount) {
        if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
            console.error("Invalid amount. Must be a positive number.");
            return;
        }
        this.balance += amount;
        this.updateBalanceDisplay();
        console.log(
            `Adding winnings: £${amount}, new balance: £${this.balance}`
        );
    }

    /**
     * Deducts a bet from the balance if sufficient funds are available.
     * Returns true if the bet was successfully deducted, otherwise false.
     * Logs the deduction for debugging purposes.
     * @param {number} [amount=1] - The amount to deduct for the bet, defaults to 1.
     * @returns {boolean} - True if the bet was successfully deducted, otherwise false.
     * @throws {Error} If the input is not a valid number.
     */
    deductBet(amount = 1) {
        if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
            throw new TypeError("Bet amount must be a positive number.");
        }
        if (this.balance >= amount) {
            this.balance -= amount;
            this.updateBalanceDisplay();
            console.log(
                `Deducting bet: £${amount}, remaining balance: £${this.balance}`
            );
            return true;
        }
        console.log(
            `Not enough balance for the bet: current balance £${this.balance}, attempted bet £${amount}`
        );
        return false;
    }
}
