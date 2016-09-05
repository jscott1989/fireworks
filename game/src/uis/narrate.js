/**
 * The narration UI
 */

import ui from './ui';
import pause from '../pause';

var container;
var textContainer;

var callback;

var audioPlayer;
var audioFiles;

const closeOnSpace = (e) => {
    if (e.code == "Space") {
        close();
    }
}

const close = () => {
    document.removeEventListener('click', close);
    document.removeEventListener('keydown', closeOnSpace);

    container.style.display = "none";
    pause.resume('narrate');
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
            document.addEventListener('keydown', closddeOnSpace);
        }, 500);

        textContainer.innerHTML = ui.parseText(textStr);
        pause.pause('narrate');
        container.style.display = "block";
        play();
    }
}