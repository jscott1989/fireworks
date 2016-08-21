/**
 * The drawing UI
 */
 import _ from "lodash";

var container;

var callback;

var selectedColour;
var selectedTool;

const closeUI = () => {
    container.style.display = "none";
    game.paused = false;
};

const selectTool = (colour) => {

};

const selectColour = (colour) => {
    // _.each(container.querySelectorAll('.colour.active'), (el) => {
    //     el.classList.remove("active");
    // });
    // container.querySelector('.colour[data-colour="' + colour + '"]').classList.add("active");
}

module.exports = {
    open(width, height, c) {
        // TODO: Allow outlines
        callback = c;
        if (container == null) {
            container = document.getElementById("drawing-ui");

            // Reset the state of the menu

            selectColour("black");
            selectTool("pencil");

            // Bind buttons

            // Create colours
            const colourContainer = container.querySelector(".colours");
            _.each([
                    "#FFF",
                    "#000",
                    "#F00",
                    "#0F0",
                    "#00F",
                    "#FF0",
                    "#0FF",
                    "#F0F",
                    "#012",
                    "#234",
                    "#456",
                    "#678",
                    "#89A",
                    "#BCD",
                    "#CDE",
                    "#DEF",
                    "#F12",
                    "#F34"
                ], (colour) => {
                    const elem = document.createElement("div", {"class": "colour", "data-colour": "blue", "style": "background: blue"});
                    // colourContainer.insertChild(elem);
            });
        }
        game.paused = true;
        container.style.display = "block";
    },

    close() {
        closeUI();
    }
}