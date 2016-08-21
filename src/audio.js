/**
 * This manages the recorded audio. It plays outside of the phaser game.
 */
import _ from 'lodash';
import recording from "./uis/recording";

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

var sounds = {};

module.exports = {
    init() {
        /**
         * We want permission to record from the start - so prompt here.
         */
        navigator.getUserMedia({ audio: true }, (stream) => {
             window.mediaRecorder = new MediaRecorder(stream, {mineType: "audio/webm"});
        }, (error) => {
            // TODO: Deal with error
        });
    },

    /**
     * Play an audio, or prompt for new if needed
     */
    playOriginal(key) {
        if (_.has(sounds, key)) {
            var audio = new Audio(sounds[key]);
            audio.play();
        } else {
            // We haven't got a sound - need to prompt for one
            this.promptForSound(key);
        }
    },

    promptForSound(key) {
        // Show an overlay to prompt for sound
        recording.open((url) => {
            console.log("Setting ", key, url);
            sounds[key] = url;

            var audio = new Audio(sounds[key]);
            audio.play();
        });
    },
}