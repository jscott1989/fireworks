/**
 * The narration UI
 */

var container;
var text;

var callback;

var audio;
var audioFiles;

const close = () => {
    document.removeEventListener('click', close);
    document.removeEventListener('keydown', close);

    container.style.display = "none";
    game.paused = false;
    audio.pause();
    callback();
}

const play = () => {
    if (audioFiles.length > 0) {
        audio = new Audio(audioFiles.shift());
        audio.addEventListener("ended", play);
        audio.play();
    }
}

module.exports = {
    open(textStr, audio, c) {
        audioFiles = audio;
        callback = c;
        if (container == null) {
            container = document.getElementById("narration-ui");
            text = container.querySelector("p");
            // Reset the state of the menu
        }

        document.addEventListener('click', close);
        document.addEventListener('keydown', close);

        text.innerHTML = textStr;
        game.paused = true;
        container.style.display = "block";
        play();
    }
}