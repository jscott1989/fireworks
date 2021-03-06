/**
 * Upload progress
 */

import _ from 'lodash';
// import text from './text';
// import audio from '../audio';
// import drawing from './drawing';
// import dataURLtoBlob from '../lib/blob.js';
import pause from './pause';


var container;
var uploadId;

const showError = (errorText, countDown, callback) => {
    pause.pause('error');

    container = document.getElementById("upload-error-ui");
    container.querySelector('blockquote').innerHTML = errorText;
    container.querySelector('.countdown').innerHTML = countDown;
    container.style.display = "block";
    
    const e = () => {
        countDown -= 1;
        container.querySelector('.countdown').innerHTML = countDown;
        if (countDown == 0) {
            // Hide the UI
            container.style.display = "none";
            pause.resume('error');
            callback();
        } else {
            setTimeout(e, 1000);
        }
    }
    setTimeout(e, 1000);
}

const upload = (url, data, callback, isFile) => {
    var req = {
        type: 'POST',
        url: url,
        data: data
    }

    if (isFile) {
        req["processData"] = false;
        req["contentType"] = false;
    }

    $.ajax(req).done((resp) => {
        if (callback != null) {
            callback(resp);
        }
    }).fail((x, text, error) => {
        showError(error, 5, () => {
            upload(url, data, callback, isFile);
        })
    });
}

module.exports = {
    init(text, sounds, callback) {
        var d = {"data": JSON.stringify({"texts": text, "sounds": sounds})};
        if (_.has(data, 'parent')) {
            d['parent'] = data.parent;
        }
        upload("/newplayer", d, (resp) => {
            uploadId = resp.id;
            callback();
        });
    },

    uploadText(data, callback) {
        upload("/text/" + uploadId, {"data": JSON.stringify(data)}, callback);
    },

    uploadImage(key, blob, callback) {
        var fd = new FormData();
        fd.append('key', key);
        fd.append('data', blob);
        upload('/image/' + uploadId, fd, callback, true);
    },

    setImage(data, callback) {
        upload("/setImage/" + uploadId, {"data": JSON.stringify(data)}, callback);
    },

    uploadSound(key, blob, callback) {
        var fd = new FormData();
        fd.append('key', key);
        fd.append('data', blob);
        upload('/sound/' + uploadId, fd, callback, true);
    },

    setSound(data, callback) {
        upload("/setSound/" + uploadId, {"data": JSON.stringify(data)}, callback);
    },

    complete(callback) {
        upload('/complete/' + uploadId, {}, callback);
    }
}