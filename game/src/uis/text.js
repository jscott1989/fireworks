/**
 * The text input UI
 */

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
            container = document.getElementById("text-input-ui");

            // Bind buttons
            container.querySelector(".save").addEventListener("click", this.onSavePressed);
        }

        // Reset the state of the menu
        container.querySelector("input").value = "";
        
        game.paused = true;
        container.style.display = "block";
    },

    close() {
        closeUI();
    },

    onSavePressed() {
        callback(container.querySelector("input").value);
        closeUI();

    }
}