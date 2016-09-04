/**
 * The microphone request UI
 */

import _ from 'lodash';
import pause from '../pause';
import audio from '../audio';

module.exports = {
    open(callback) {
        var container = document.getElementById("microphone-container");
        container.querySelector(".continue").addEventListener("click", () => {
            pause.resume('microphone-request');
            container.style.display = "none";
            audio.init(() => {
                callback();
            });
        });

        pause.pause('microphone-request');
        container.style.display = "block";
    }
}