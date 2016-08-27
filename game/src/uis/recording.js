/**
 * The recording UI
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
            container = document.getElementById("recording-ui");

            // Reset the state of the menu

            // Bind buttons
            container.querySelector(".start-recording").addEventListener("click", this.onStartRecordingPressed);
            container.querySelector(".stop-recording").addEventListener("click", this.onStopRecordingPressed);

        }
        game.paused = true;
        container.style.display = "block";
    },

    close() {
        closeUI();
    },

    onStartRecordingPressed() {
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
        };
 
        mediaRecorder.onstop = () => {
            var blob = new Blob(chunks, {type: "audio/webm"});
            chunks = [];

            var url = window.URL.createObjectURL(blob);

            // For now we just close the interface and return
            callback(url);
            closeUI();
        }
        
        mediaRecorder.onwarning = (e) => {
            console.log('Warning: ' + e);
        };

    },

    onStopRecordingPressed() {
        mediaRecorder.stop();
    }
}