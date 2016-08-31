/**
 * The text input UI
 */

import _ from 'lodash';
import $ from 'jQuery';
import text from './text';
import audio from '../audio';
import drawing from './drawing';
import dataURLtoBlob from '../lib/blob.js';

var container;

var callback;

const closeUI = () => {
    container.style.display = "none";
    game.paused = false;
}

const setPercentage = (percentage) => {
    container.querySelector(".complete").style.width = percentage + "%";
    container.querySelector(".status").innerHTML = percentage + "%";
}

module.exports = {
    open(c) {
        callback = c;
        if (container == null) {
            container = document.getElementById("upload-ui");

            // Bind buttons
            container.querySelector(".continue").addEventListener("click", this.continuePressed);
        }

        setPercentage(0);

        // First we need to build a list of items to upload

        const textToUpload = text.all();
        const imagesToUpload = drawing.all();
        const soundsToUpload = audio.all();

        const totalUploads = _.keys(textToUpload).length + _.keys(imagesToUpload).length + _.keys(soundsToUpload).length
        var uploaded = 0;

        // Text can be uploaded in a single block as it is relatively small
        var d = {text: JSON.stringify(textToUpload)};

        if (_.has(data, 'parent')) {
            d['parent'] = data.parent;
        }

        $.ajax({
            type: 'POST',
            url: '/startupload',
            data: d
        }).done((resp) => {
            uploaded += _.keys(textToUpload).length;
            setPercentage(uploaded / totalUploads * 100);

            const uploadId = resp.id;

            const uploadImages = (images) => {
                if (images.length == 0) {
                    // Done with images, move on to sounds
                    uploadSounds(_.keys(soundsToUpload));
                    return;
                }

                const image = images.shift();

                dataURLtoBlob(imagesToUpload[image], (d) => {
                    var fd = new FormData();
                    fd.append('key', image);
                    fd.append('data', d);
                    $.ajax({
                        type: 'POST',
                        url: '/uploadimage/' + uploadId,
                        data: fd,
                        processData: false,
                        contentType: false
                    }).done((d) => {
                        uploaded += 1;
                        setPercentage(uploaded / totalUploads * 100);
                        uploadImages(images);
                    });
                });
            }

            const uploadSounds = (sounds) => {
                if (sounds.length == 0) {
                    $.ajax({
                        type: 'POST',
                        url: '/markcomplete/' + uploadId
                    }).done(() => {
                        container.querySelector("footer").style.display = "block";
                    });
                    return;
                }

                const sound = sounds.shift();

                dataURLtoBlob(soundsToUpload[sound], (d) => {
                    var fd = new FormData();
                    fd.append('key', sound);
                    fd.append('data', d);
                    $.ajax({
                        type: 'POST',
                        url: '/uploadsound/' + uploadId,
                        data: fd,
                        processData: false,
                        contentType: false
                    }).done((d) => {
                        uploaded += 1;
                        setPercentage(uploaded / totalUploads * 100);
                        uploadSounds(sounds);
                    });
                });
            }

            uploadImages(_.keys(imagesToUpload));
        });

        // Reset the state of the menu
        game.paused = true;
        container.style.display = "block";
    },

    continuePressed() {
        closeUI();
        callback();
    }
}