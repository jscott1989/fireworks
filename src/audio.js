/**
 * This manages the recorded audio. It plays outside of the phaser game.
 */


navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

var mediaRecorder;

module.exports = {
    init() {
        /**
         * We want permission to record from the start - so prompt here.
         */
        navigator.getUserMedia({ audio: true }, (stream) => {
             mediaRecorder = new MediaRecorder(stream, {mineType: "audio/webm"});
        }, (error) => {
            // TODO: Deal with error
        });
    },

    /**
     * Play an audio, or prompt for new if needed
     */
    playOriginal(key) {

    },


    record() {
        mediaRecorder.reset();
        var chunks = [];

        
        mediaRecorder.start();

        setTimeout(() => {
            mediaRecorder.stop();
        }, 5000);

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        }

        mediaRecorder.onerror = (e) => {
            console.log('Error: ', e);
        };

        mediaRecorder.onstart = () => {
            console.log('Started, state = ' + mediaRecorder.state);
        };
 
        mediaRecorder.onstop = () => {
            console.log('Stopped, state = ' + mediaRecorder.state);

            var blob = new Blob(chunks, {type: "audio/webm"});
            chunks = [];

            var url = window.URL.createObjectURL(blob);
        }
        
        mediaRecorder.onwarning = (e) => {
            console.log('Warning: ' + e);
        };
    }
}