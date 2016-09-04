/**
 * The main menu UI
 */

import ui from './ui';
import pause from '../pause';

module.exports = {
    open(callback) {
        var container = document.getElementById("menu-container");

        container.querySelector(".begin").addEventListener("click", () => {
            pause.resume('menu');
            container.style.display = "none";
            callback();
        });

        pause.pause('menu');
        container.style.display = "block";
    }
}