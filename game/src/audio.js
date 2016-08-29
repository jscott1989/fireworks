/**
 * This manages the recorded audio. It plays outside of the phaser game.
 */
import _ from 'lodash';
import recording from "./uis/recording";
import narrate from "./uis/narrate";

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

window.sounds = {};

module.exports = {
    init() {
        /**
         * We want permission to record from the start - so prompt here.
         */
        navigator.getUserMedia({ audio: true }, (stream) => {
            window.mediaStream = stream;
            window.mediaRecorder = new MediaRecorder(stream, {mineType: "audio/webm"});

            var ctx = new AudioContext();
            var audioSrc = ctx.createMediaStreamSource(mediaStream);
            window.audioAnalyser = ctx.createAnalyser();
            audioSrc.connect(audioAnalyser);

            window.frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);

        }, (error) => {
            // TODO: Deal with error
        });
    },

    /**
     * Play an audio, or prompt for new if needed
     */
    playOriginal(key, title, instruction) {
        if (_.has(sounds, key)) {
            var audio = new Audio(sounds[key]);
            audio.play();
        } else {
            // We haven't got a sound - need to prompt for one
            this.promptForSound(key, title, instruction, () => {
                var audio = new Audio(sounds[key]);
                audio.play();
            });
        }
    },

    promptForSound(key, title, instruction, callback) {
        // Show an overlay to prompt for sound
        if (_.has(sounds, key)) {
            callback();
        } else {
            recording.open(title, instruction, (url) => {
                sounds[key] = url;
                callback();
            });
        }
    },

    narrate(set) {
        if (set.length > 0) {
            const s = set.shift();
            narrate.open(s[0], s[1], () => {
                this.narrate(set);
            });
        }
    }
}