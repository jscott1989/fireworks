/**
 * Main Menu
 */

 import microphone from "../uis/microphone-request";

 import audio from "../audio";
 import menu from "../uis/menu";

module.exports = {
    create() {
        menu.open(() => {
            microphone.open(() => {
                game.state.start("play");
            });
        });
    }
}