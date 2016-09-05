/**
 * This manages the recorded audio. It plays outside of the phaser game.
 */
import _ from 'lodash';
import recording from "./uis/recording";
import narrate from "./uis/narrate";
import upload from './upload';
import microphone from "./uis/microphone-error.js";

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

window.sounds = {};

module.exports = {
    all() {
        return sounds;
    },

    setMass(data, callback) {
        _.each(_.keys(data), (key) => {
            sounds[key] = data[key];
        });
        upload.setSound(data, callback);
    },

    setURL(key, value, callback) {
        sounds[key] = value;
        var d = {};
        d[key] = value;
        upload.setSound(d, callback);
    },

    init(callback) {
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

            callback();
        }, (error) => {
            // TODO: Deal with error
            microphone.open(error.name + " " + error.message);
        });
    },

    /**
     * Play an audio, or prompt for new if needed
     */
    playOriginal(key, title, instruction, callback) {
        if (_.has(sounds, key)) {
            var audio = new Audio(sounds[key]);
            audio.addEventListener("ended", () => {
                if (callback != null) {
                    callback();
                }
            });
            audio.play();
        } else {
            // We haven't got a sound - need to prompt for one
            this.promptForSound(key, title, instruction, () => {
                var audio = new Audio(sounds[key]);
                audio.addEventListener("ended", () => {
                    if (callback != null) {
                        callback();
                    }
                });
                audio.play();
            });
        }
    },

    playOld(key, callback) {
        var audio = new Audio(data.sound[key]);
        audio.addEventListener("ended", () => {
            if (callback != null) {
                callback();
            }
        });
        audio.play();
    },

    promptForSound(key, title, instruction, callback) {
        // Show an overlay to prompt for sound
        if (_.has(sounds, key)) {
            callback();
        } else {
            recording.open(title, instruction, (url, blob) => {
                sounds[key] = url;
                upload.uploadSound(key, blob);
                callback();
            });
        }
    },

    narrate(set, callback) {
        if (set.length > 0) {
            const s = set.shift();
            narrate.open(s[0], s[1], () => {
                this.narrate(set, callback);
            });
        } else if (callback != null) {
            callback();
        }
    }
}