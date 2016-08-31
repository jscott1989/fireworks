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
    },


    modifyTilesheet(tiles) {
        // Override tiles as specified

        const id = v4();

        var image = new Image();
        image.onload = () => {
            image.onload = () => {};

            var canvas = document.createElement('canvas');
            // document.querySelector("body").appendChild(canvas);
            canvas.width = image.width;
            canvas.height = image.height;
            var canvasContext = canvas.getContext('2d');

            canvasContext.drawImage(image, 0, 0, image.width, image.height);

            const loadTile = (tiles) => {
                if (tiles.length == 0) {
                    canvas.toBlob((blob) => {
                        game.load.image(id, window.URL.createObjectURL(blob));
                        game.load.onLoadComplete.addOnce(() => {
                            level1.addTilesetImage('level1-tiles', id);
                            _.each(level1.layers, (layer) => {
                                layer.dirty = true;
                            });
                        })
                        game.load.start();
                    });
                    return;
                }

                var tile = tiles.shift();
                var image = new Image();
                image.onload = () => {
                    canvasContext.drawImage(image, tile[1], tile[2], image.width, image.height);
                    loadTile(tiles);
                }
                image.src = tile[0];
                if (image.complete) {
                  image.onload();
                }

            }

            loadTile(tiles);
        }

        image.src = "/s/assets/level1-tiles.png";
        if (image.complete) {
          image.onload();
        }
    }
}