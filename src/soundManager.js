import { Howl } from "howler";

/**
 * Manages the sound effects within an application using Howler.js.
 */
class SoundManager {
    /**
     * Constructs a new instance of SoundManager.
     */
    constructor() {
        /**
         * @type {Object.<string, Howl>}
         * Stores the Howl instances keyed by their identifiers.
         */
        this.sounds = {};
    }

    /**
     * Initialises the sound manager with provided
     *
     * @param {*} initData - The data used for initializing the sound manager.
     */
    initialise(initData) {
        // Potentially load in sounds here at the start of the game
    }

    /**
     * Loads a sound into the manager if it's not already loaded.
     *
     * @param {string} key - The unique key to associate with the sound.
     * @param {string} src - The source URL of the sound file.
     */
    loadSound(key, src) {
        if (!this.sounds[key]) {
            this.sounds[key] = new Howl({
                src: [src],
            });
        }
    }

    /**
     * Stops the sound associated with the provided key, if it is currently playing.
     *
     * @param {string} key - The key of the sound to stop.
     */
    stopSound(key) {
        if (this.sounds[key]?.playing()) {
            this.sounds[key].stop();
        }
    }

    /**
     * Plays the sound associated with the provided key. Logs an error if the sound is not found.
     *
     * @param {string} key - The key of the sound to play.
     */
    playSound(key) {
        if (this.sounds[key]) {
            this.sounds[key].play();
        } else {
            console.log(`Sound with key ${key} not found.`);
        }
    }
}

export const soundManager = new SoundManager();
