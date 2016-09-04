/**
 * The colour input UI
 */

import _ from 'lodash';
import text from './text';
import pause from '../pause';
import ui from './ui';

var container;

var callback;
var sKey;

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

const closeUI = () => {
    container.style.display = "none";
    pause.resume('colour');
}

module.exports = {
    open(key, title, instruction, c) {
        callback = c;
        sKey = key;
        container = document.getElementById("colour-input-ui");

        // Bind buttons
        _.each(container.querySelectorAll("button"), (b) => {
            b.addEventListener("click", this.onSavePressed);
        });

        // Reset the state of the menu
        container.querySelector("h1").innerHTML = ui.parseText(title);
        container.querySelector("p").innerHTML = ui.parseText(instruction);
        
        pause.pause('colour');
        container.style.display = "block";
    },

    onSavePressed(e) {
        e.preventDefault();
        closeUI();
        var v = rgb2hex(e.srcElement.style.background);
        text.set(sKey, v);
        callback(v);
        container.innerHTML = container.innerHTML;
    }
}