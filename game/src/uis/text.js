/**
 * The text input UI
 */

import _ from 'lodash';
import upload from '../upload';
import pause from '../pause';
import ui from './ui';

var container;

var callback;

const closeUI = () => {
    container.style.display = "none";
    pause.resume('text');
}


window.text = {};

module.exports = {
    all() {
        return text;
    },
    
    hasText(key) {
        return _.has(text, key);
    },

    get(key) {
        return text[key];
    },

    set(key, value) {
        text[key] = value;
        upload.uploadText(key, value);
    },

    getOrAsk(key, title, instruction, c) {
        if (_.has(text, key)) {
            c(text[key]);
        } else {
            this.open(title, instruction, (t) => {
                text[key] = t;
                upload.uploadText(key, t);
                c(t);
            });
        }
    },

    open(title, instruction, c) {
        callback = c;
        container = document.getElementById("text-input-ui");

        // Bind buttons
        container.querySelector("form").addEventListener("submit", this.onSavePressed);

        // Reset the state of the menu
        container.querySelector("h1").innerHTML = ui.parseText(title);
        container.querySelector("p").innerHTML = ui.parseText(instruction);
        container.querySelector("input").value = "";
        
        pause.pause('text');
        container.style.display = "block";

        container.querySelector("input").focus();
    },

    onSavePressed(e) {
        e.preventDefault();
        closeUI();
        callback(container.querySelector("input").value);
        container.innerHTML = container.innerHTML;
    }
}