/**
 * The colour input UI
 */

import _ from 'lodash';
import text from './text';

var container;

var callback;
var key;

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

const closeUI = () => {
    container.style.display = "none";
    game.paused = false;
}

module.exports = {
    open(key, title, instruction, c) {
        callback = c;
        key = key;
        container = document.getElementById("colour-input-ui");

        // Bind buttons
        _.each(container.querySelectorAll("button"), (b) => {
            b.addEventListener("click", this.onSavePressed);
        });

        // Reset the state of the menu
        container.querySelector("h1").innerHTML = title;
        container.querySelector("p").innerHTML = instruction;
        
        game.paused = true;
        container.style.display = "block";
    },

    onSavePressed(e) {
        e.preventDefault();
        closeUI();
        var v = rgb2hex(e.srcElement.style.background);
        text.set(key, v);
        callback(v);
        container.innerHTML = container.innerHTML;
    }
}