/**
 * Modify sprites
 */
import _ from 'lodash';
import { v4 } from 'node-uuid'

module.exports = {
    createSprite(files, width, height, frames, callback) {
        const id = v4();

        var canvas = document.createElement('canvas');
        // document.querySelector("body").appendChild(canvas);
        canvas.width = width * frames;
        canvas.height = height;
        var canvasContext = canvas.getContext('2d');

        const loadFiles = (files) => {
            if (files.length == 0) {
                // Done
                canvas.toBlob((blob) => {
                    game.load.spritesheet(id, window.URL.createObjectURL(blob), width, height, frames);
                    game.load.onLoadComplete.addOnce(() => {
                        if (callback != null) {
                            callback(id);
                            callback = null;
                        }
                    })
                    game.load.start();
                });

                return;
            }
            var file = files.shift();

            var image = new Image()
            image.onload = () => {
                image.onload = () => {}; // For some reason it got called twice
                _.each(file[1], (location) => {
                    canvasContext.drawImage(image, location[0], location[1], image.width, image.height);
                });
                loadFiles(files);
            }
            image.src = file[0];
            if (image.complete) {
              image.onload();
            }
        };

        loadFiles(files);
    }
}