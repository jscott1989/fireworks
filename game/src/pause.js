/**
 * Pause/resume
 */

var pauses = [];

module.exports = {
    pause(key) {
        pauses.push(key);

        if (pauses.length > 0 && !game.paused) {
            game.paused = true;
        }
    },

    resume(key) {
        const i = pauses.indexOf(key);
        if (i > -1) {
            pauses.splice(i, 1);
        }

        if (pauses.length < 1 && game.paused) {
            game.paused = false;
        }
    }
}