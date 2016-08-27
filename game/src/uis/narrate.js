/**
 * The narration UI
 */

var container;

var callback;

const closeUI = () => {
    container.style.display = "none";
    game.paused = false;
}

module.exports = {
    open(text, c) {
        callback = c;
        if (container == null) {
            container = document.getElementById("narration-ui");

            // Reset the state of the menu
        }
        game.paused = true;
        container.style.display = "block";
    },

    close() {
        closeUI();
    }
}