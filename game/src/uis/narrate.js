/**
 * The narration UI
 */

import ui from './ui';

var container;
var textContainer;

var callback;

var audioPlayer;
var audioFiles;

const close = () => {
    document.removeEventListener('click', close);
    document.removeEventListener('keydown', close);

    container.style.display = "none";
    game.paused = false;
    if (audioPlayer != null) {
        audioPlayer.pause();
    }
    callback();
}

const play = () => {
    if (audioFiles.length > 0) {
        var a = ui.parseSound(audioFiles.shift());
        audioPlayer = new Audio(a);
        audioPlayer.addEventListener("ended", play);
        audioPlayer.play();
    }
}

module.exports = {
    open(textStr, audio, c) {
        audioFiles = audio;
        callback = c;
        if (container == null) {
            container = document.getElementById("narration-ui");
            textContainer = container.querySelector("p");
            // Reset the state of the menu
        }

        setTimeout(() => {
            document.addEventListener('click', close);
            document.addEventListener('keydown', close);
        }, 500);

        textContainer.innerHTML = ui.parseText(textStr);
        game.paused = true;
        container.style.display = "block";
        play();
    }
}