/**
 * The recording UI
 */

var container;
var statusText;

var callback;


var isRecording = false;
var isCountingDown = false;
var recordingCountdown = 3;
var countdownTimeout;

var url;

const closeUI = () => {
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
            startRecordingCountdown();
            document.removeEventListener('keydown', keydown);
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
    countup();
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
    };

    mediaRecorder.onstop = () => {
        var blob = new Blob(chunks, {type: "audio/webm"});
        chunks = [];

        url = window.URL.createObjectURL(blob);

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
    callback(url);
    closeUI();
}

const play = () => {

}

const stopPlaying = () => {

}

const reset = () => {
    
}

module.exports = {
    open(c) {
        callback = c;
        if (container == null) {
            container = document.getElementById("recording-ui");
            statusText = container.querySelector(".status");

            // Reset the state of the menu

            // Bind buttons
            // container.querySelector(".start-recording").addEventListener("click", this.onStartRecordingPressed);
            // container.querySelector(".stop-recording").addEventListener("click", this.onStopRecordingPressed);


        }

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