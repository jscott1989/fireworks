/**
 * The text input UI
 */

import _ from 'lodash';
import upload from './upload';

var container;

var callback;

const closeUI = () => {
    container.style.display = "none";
    game.paused = false;
}

module.exports = {
    open(c) {
        callback = c;
        if (container == null) {
            container = document.getElementById("save-ui");

            // Bind buttons
            container.querySelector(".yes").addEventListener("click", this.yesPressed);
            container.querySelector(".no").addEventListener("click", this.noPressed);
        }

        // Reset the state of the menu
        _.each(container.querySelectorAll(".name"), (el) => {
            el.innerHTML = data.text["name"];
        });
        
        game.paused = true;
        container.style.display = "block";
    },

    yesPressed() {
        closeUI();
        upload.open(callback);
    },

    noPressed() {
        closeUI();
        callback();
    }
}