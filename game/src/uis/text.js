/**
 * The text input UI
 */

import _ from 'lodash';

var container;

var callback;

const closeUI = () => {
    container.style.display = "none";
    game.paused = false;
}


var text = {};

module.exports = {
    hasText(key) {
        return _.has(text, key);
    },

    get(key) {
        return text[key];
    },

    getOrAsk(key, title, instruction, c) {
        if (_.has(text, key)) {
            c(text[key]);
        } else {
            this.open(title, instruction, (t) => {
                text[key] = t;
                c(t);
            });
        }
    },

    open(title, instruction, c) {
        callback = c;
        if (container == null) {
            container = document.getElementById("text-input-ui");

            // Bind buttons
            container.querySelector("form").addEventListener("submit", this.onSavePressed);
        }

        // Reset the state of the menu
        container.querySelector("h1").innerHTML = title;
        container.querySelector("p").innerHTML = instruction;
        container.querySelector("input").value = "";
        
        game.paused = true;
        container.style.display = "block";

        container.querySelector("input").focus();
    },

    close() {
        closeUI();
    },

    onSavePressed(e) {
        callback(container.querySelector("input").value);
        closeUI();
        e.preventDefault();
    }
}