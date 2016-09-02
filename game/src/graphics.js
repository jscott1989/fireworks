/**
 * Modify sprites
 */
import _ from 'lodash';
import { v4 } from 'node-uuid'
import drawing from './uis/drawing';

const getURL = (str) => {
    if (str[0] == "<") {
        // It's one of two things
        if (str[1] == "%") {
            // Past
            return data.image[str.substr(2, str.length - 4)];
        } else {
            // Present
            return drawing.get(str.substr(2, str.length - 4));
        }
    } else {
        return str;
    }
}

const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const recolorImage = (canvas, context, replacements) => {

    var replacementsRGB = [];

    for (var x = 0; x < replacements.length; x++) {
        var oldC = hexToRgb(replacements[x][0]);
        var newC = hexToRgb(replacements[x][1]);
        replacementsRGB.push([oldC, newC]);
    }

    // pull the entire image into an array of pixel data
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // examine every pixel, 
    // change any old rgb to the new-rgb
    for (var i=0;i<imageData.data.length;i+=4)
      {
        for (var x = 0; x < replacementsRGB.length; x++) {
            // is this pixel the old rgb?
          if(imageData.data[i]==replacementsRGB[x][0].r &&
             imageData.data[i+1]==replacementsRGB[x][0].g &&
             imageData.data[i+2]==replacementsRGB[x][0].b
          ){
              // change to your new rgb
              imageData.data[i]=replacementsRGB[x][1].r;
              imageData.data[i+1]=replacementsRGB[x][1].g;
              imageData.data[i+2]=replacementsRGB[x][1].b;
          }
        }
      }
    // put the altered data back on the canvas  
    context.putImageData(imageData,0,0);
}



module.exports = {
    shadeColor(color, percent) {   
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    },

    createSprite(prefiles, replacements, postfiles, width, height, frames, callback) {
        const id = v4();

        var canvas = document.createElement('canvas');
        // document.querySelector("body").appendChild(canvas);
        canvas.width = width * frames;
        canvas.height = height;
        var canvasContext = canvas.getContext('2d');

        const loadFiles = (files, callback) => {
            if (files.length == 0) {
                callback();

                return;
            }
            var file = files.shift();

            var image = new Image()
            image.crossOrigin = "Anonymous";
            image.onload = () => {
                image.onload = () => {}; // For some reason it got called twice
                _.each(file[1], (location) => {
                    if (location.length > 2) {
                        canvasContext.drawImage(image, location[2], location[3], location[4], location[5], location[0], location[1], location[4], location[5]);
                    } else {
                        canvasContext.drawImage(image, location[0], location[1], image.width, image.height);
                    }
                });
                loadFiles(files, callback);
            }
            image.src = getURL(file[0]);
            if (image.complete) {
              image.onload();
            }
        };

        loadFiles(prefiles, () => {
            // Done
            recolorImage(canvas, canvasContext, replacements);

            loadFiles(postfiles, () => {
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
            });
        });
    },


    modifyTilesheet(tiles) {
        // Override tiles as specified

        const id = v4();

        var image = new Image();
        image.crossOrigin = "Anonymous";
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
                image.crossOrigin = "Anonymous";
                image.onload = () => {
                    canvasContext.drawImage(image, tile[1], tile[2], image.width, image.height);
                    loadTile(tiles);
                }
                image.src = getURL(tile[0]);
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