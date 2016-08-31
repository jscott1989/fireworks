/**
 * The recording UI
 */

import ui from './ui';

var container;
var statusText;

var callback;


var isRecording = false;
var isCountingDown = false;
var recordingCountdown = 3;
var countdownTimeout;

var beepAudio = new Audio("/s/assets/ui/beep.mp3");
var playingAudio;
var url;

const closeUI = () => {
    document.removeEventListener('keydown', keydown);
    container.innerHTML = container.innerHTML;
    container.style.display = "none";
    game.paused = false;
}


const startRecordingCountdown = () => {
    isRecording = true;
    isCountingDown = true;
    recordingCountdown = 3;
    statusText.innerHTML = "Starting recording in 3";
    document.addEventListener("keyup", keyup);
    container.querySelector(".complete-controls").style.display = "none";
    beepAudio.play();
    countdownTimeout = setTimeout(countdown, 1000);
};

const countdown = () => {
    if (!isRecording) {
        return;
    }

    recordingCountdown -= 1;
    statusText.innerHTML = "Starting recording in " + recordingCountdown;
    // TODO: Play Sound
    if (recordingCountdown == 0) {
        isCountingDown = false;
        startRecording();
    } else {
        beepAudio.play();
        countdownTimeout = setTimeout(countdown, 1000);
    }
}

const countup = () => {
    var countdownText = "" + recordingCountdown;
    if (countdownText.length == 1) {
        countdownText = "0" + countdownText;
    }
    statusText.innerHTML = "Recording: 0:" + countdownText;
    recordingCountdown += 1;
    countdownTimeout = setTimeout(countup, 1000);
}

const keydown = (e) => {
    if (!isRecording) {
        if (e.code == "Space") {
            // Space is pressed, start recording
            document.removeEventListener('keydown', keydown);
            startRecordingCountdown();
        }
    }
};

const keyup = (e) => {
    if (e.code == "Space") {
        stopRecording();
        document.removeEventListener('keyup', keyup);
    }
};

const startRecording = () => {
    // mediaRecorder.reset();
    var chunks = [];
    
    mediaRecorder.start();

    mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
    }

    mediaRecorder.onerror = (e) => {
        // console.log('Error: ', e);
    };

    mediaRecorder.onstart = () => {
        // console.log('Started, state = ' + mediaRecorder.state);
        countup();
    };

    mediaRecorder.onstop = () => {
        var blob = new Blob(chunks, {type: "audio/webm"});
        chunks = [];

        url = window.URL.createObjectURL(blob);

        play();

        resetAfterStop();
    };
    
    mediaRecorder.onwarning = (e) => {
        console.log('Warning: ' + e);
    };
};

const resetAfterStop = () => {
    isRecording = false;
    clearTimeout(countdownTimeout);

    if (url == null) {
        statusText.innerHTML = "Hold Space to start recording";
        container.querySelector(".complete-controls").style.display = "none";
    } else {
        statusText.innerHTML = "Hold Space to re-record";
        container.querySelector(".complete-controls").style.display = "block";
    }

    document.addEventListener("keydown", keydown);
}

const stopRecording = () => {
    // Reset the state
    if (!isCountingDown) {
        mediaRecorder.stop();
    } else {
        resetAfterStop();
    }
};

const save = () => {
    closeUI();
    callback(url);
}

const play = () => {
    playingAudio = new Audio(url);
    playingAudio.play();
    container.querySelector(".play").innerHTML = "Stop";
    playingAudio.addEventListener("ended", () => {
        playingAudio = null;
        container.querySelector(".play").innerHTML = "Play";
    })
}

const stopPlaying = () => {
    playingAudio.pause();
    playingAudio = null;
    container.querySelector(".play").innerHTML = "Play";
}

const playPressed = () => {
    if (playingAudio == null) {
        play();
    } else {
        stopPlaying();
    }
}

const reset = () => {
    url = null;
    resetAfterStop();
}

module.exports = {
    open(title, instruction, c) {
        callback = c;
        container = document.getElementById("recording-ui");
        statusText = container.querySelector(".status");

        // Reset the state of the menu

        // Bind buttons
        container.querySelector(".save").addEventListener("click", save);
        container.querySelector(".play").addEventListener("click", playPressed);
        container.querySelector(".reset").addEventListener("click", reset);

        container.querySelector("h1").innerHTML = ui.parseText(title);
        container.querySelector("p").innerHTML = ui.parseText(instruction);
        isRecording = false;
        recordingCountdown = 3;
        game.paused = true;
        container.style.display = "block";

        resetAfterStop();
    },

    close() {
        closeUI();
    }
}