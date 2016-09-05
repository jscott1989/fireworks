/**
 * The drawing UI
 */
 import _ from "lodash";
 import upload from '../upload';
 import pause from '../pause';
 require("floodfill");
 import ui from './ui';
 import dataURLtoBlob from '../lib/blob';

var container;

var selectedColour;
var selectedTool;

var drawings = {};

var undoQueue = [];

const tools = {
    pencil(x, y) {
        canvasContext.fillStyle = selectedColour;
        canvasContext.fillRect( x, y, 1, 1 );

        displayCanvasContext.fillStyle = selectedColour;
        displayCanvasContext.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

        if (isTiled) {
            previewCanvasContext.fillStyle = selectedColour;
            _.each(_.range(0, 3), (xx) => {
                _.each(_.range(0, 3), (yy) => {
                    previewCanvasContext.fillRect(xx * tWidth + x, yy * tHeight + y, 1, 1);
                });
            });
        }
        edited = true;
    },

    brush(x, y) {
        canvasContext.fillStyle = selectedColour;
        canvasContext.fillRect( x - 1, y, 3, 1 );
        canvasContext.fillRect( x, y - 1, 1, 3 );

        displayCanvasContext.fillStyle = selectedColour;
        displayCanvasContext.fillRect((x - 1) * pixelSize, y * pixelSize, pixelSize * 3, pixelSize);
        displayCanvasContext.fillRect(x * pixelSize, (y - 1) * pixelSize, pixelSize, pixelSize * 3);

        if (isTiled) {
            previewCanvasContext.fillStyle = selectedColour;
            _.each(_.range(0, 3), (xx) => {
                _.each(_.range(0, 3), (yy) => {
                    previewCanvasContext.fillRect(xx * tWidth + x - 1, yy * tHeight + y, 3, 1 );
                    previewCanvasContext.fillRect(xx * tWidth + x, yy * tHeight + y - 1, 1, 3 );
                });
            });
        }
        edited = true;
    },

    fill(x, y) {
        if (!edited) {
            // Just fill them all
            canvasContext.fillStyle = selectedColour;
            displayCanvasContext.fillStyle = selectedColour;
            previewCanvasContext.fillStyle = selectedColour;

            canvasContext.fillRect(0, 0, tWidth, tHeight);
            displayCanvasContext.fillRect(0, 0, tWidth * pixelSize, tHeight * pixelSize);
            displayCanvasContext.fillRect(0, 0, tWidth * 3, tHeight * 3);

            edited = true;
        }
        canvasContext.fillStyle = selectedColour;
        canvasContext.fillFlood(x, y);

        displayCanvasContext.fillStyle = selectedColour;
        displayCanvasContext.fillFlood(x * pixelSize, y * pixelSize);

        // Simulating the flood fill is more trouble than it's worth, instead we will
        // just recreate the image from scratch

        var data = canvasContext.getImageData(0, 0, tWidth, tHeight).data;
        _.each(_.range(canvas.width), (x) => {
            _.each(_.range(canvas.height), (y) => {
                var idx = (y * tWidth + x) * 4;
                var red = data[idx];
                var green = data[idx + 1];
                var blue = data[idx + 2];
                var alpha = data[idx + 3];

                if (alpha == 0 && tBackground != null) {
                    previewCanvasContext.fillStyle = tBackground;
                } else {
                    previewCanvasContext.fillStyle = "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
                }

                _.each(_.range(3), (xx) => {
                    _.each(_.range(3), (yy) => {
                        previewCanvasContext.fillRect(xx * tWidth + x, yy * tHeight + y, 1, 1);
                    });
                });
            });
        });
    },

    eraser(x, y) {
        canvasContext.clearRect( x, y, 1, 1 );
        displayCanvasContext.clearRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

        _.each(_.range(3), (xx) => {
            _.each(_.range(3), (yy) => {
                if (tBackground != null) {
                    previewCanvasContext.fillStyle = tBackground;
                    previewCanvasContext.fillRect(xx * tWidth + x, yy * tHeight + y, 1, 1);
                } else {
                    previewCanvasContext.clearRect(xx * tWidth + x, yy * tHeight + y, 1, 1);
                }
            });
        });
        edited = true;
    }
}

// Configuration
const transparentColours = [
    "#8C8C8C", "#F0F0F0"
];

const MAX_CANVAS_HEIGHT = 300;


var pixelSize;
var guideImage = new Image();
guideImage.crossOrigin = "Anonymous";

var isTiled;
var tWidth;
var tHeight;
var tBackground;
var edited = false;

// On-screen elements
var overCanvas;
var overCanvasContext;
var displayCanvas;
var displayCanvasContext;
var underCanvas;
var underCanvasContext;
var gridCheckbox;
var previewCanvas;
var previewCanvasContext;

// Virtual elements
var canvas = document.createElement('canvas');
var canvasContext = canvas.getContext('2d');

const selectColour = (colour) => {
    _.each(container.querySelectorAll('.colour.active'), (el) => {
        el.classList.remove("active");
    });
    container.querySelector('.colour[data-colour="' + colour + '"]').classList.add("active");
    selectedColour = colour;
};

const selectTool = (tool) => {
    _.each(container.querySelectorAll('.tool.active'), (el) => {
        el.classList.remove("active");
    });
    container.querySelector('.tool[data-tool="' + tool + '"]').classList.add("active");
    selectedTool = tool;
};

const closeUI = () => {
    container.innerHTML = container.innerHTML;
    container.style.display = "none";
    pause.resume('drawing');
};

const draw = (x, y) => {
    tools[selectedTool](x, y);
}


const drawOverlay = () => {
    const rect = underCanvas.getBoundingClientRect();
    overCanvasContext.clearRect(0, 0, rect.width, rect.height);

    // Draw the grid
    if (gridCheckbox.checked) {
        _.each(_.range(rect.width / pixelSize), (x) => {
            overCanvasContext.beginPath();
            overCanvasContext.moveTo(0,x * pixelSize);
            overCanvasContext.lineTo(rect.width,x * pixelSize);
            overCanvasContext.stroke();

            overCanvasContext.beginPath();
            overCanvasContext.moveTo(x * pixelSize, 0);
            overCanvasContext.lineTo(x * pixelSize, rect.height);
            overCanvasContext.stroke();
        });

        overCanvasContext.beginPath();
        overCanvasContext.moveTo(0,rect.height);
        overCanvasContext.lineTo(rect.width,rect.height);
        overCanvasContext.stroke();

        overCanvasContext.beginPath();
        overCanvasContext.moveTo(rect.width, 0);
        overCanvasContext.lineTo(rect.width,rect.height);
        overCanvasContext.stroke();

    }
}

module.exports = {
    setMass(data, callback) {
        _.each(_.keys(data), (key) => {
            drawings[key] = data[key];
        });
        upload.setImage(data, callback);
    },

    setURL(key, value, callback) {
        drawings[key] = value;
        var d = {};
        d[key] = value;
        upload.setImage(d, callback);
    },

    set(key, value, callback) {
        dataURLtoBlob(value, (blob) => {
            drawings[key] = value;
            upload.uploadImage(key, blob, callback);
        });
    },

    all() {
        return drawings;
    },

    get(key) {
        return drawings[key];
    },
    
    open(key, title, instruction, width, height, guide, background, tiled, callback) {
        if (_.has(drawings, key)) {
            callback(drawings[key]);
            return;
        }
        var self = this;

        isTiled = tiled;
        tWidth = width;
        tHeight = height;
        tBackground = background;
        container = document.getElementById("drawing-ui");
        previewCanvas = container.querySelector(".preview-canvas");
        previewCanvasContext = previewCanvas.getContext('2d');
        overCanvas = container.querySelector(".over-canvas");
        overCanvasContext = overCanvas.getContext('2d');
        underCanvas = container.querySelector(".under-canvas");
        underCanvasContext = underCanvas.getContext('2d');
        displayCanvas = container.querySelector(".display-canvas");
        displayCanvasContext = displayCanvas.getContext('2d');
        gridCheckbox = container.querySelector(".show-grid");
        edited = false;

        // Create colours
        var i = 0;
        const colourContainer = container.querySelector(".colours");
        colourContainer.innerHTML = "";
        _.each([
                "#000001",
                "#505050",
                "#A0A0A0",
                "#8E8E8E",
                "#FFFFFF",
                "#000041",
                "#0000CB",
                "#02DA81",
                "#80FE1A",
                "#FFEE00",
                "#FFAB00",
                "#FE0000",
                "#FE00FF",
                "#202040",
                "#6464C9",
                "#6CD9AC",
                "#B7FC7E",
                "#FCF47E",
                "#FFD480",
                "#FF8080",
                "#FF80FF"
            ], (colour) => {
                i += 1;
                const elem = document.createElement("div");
                elem.className = "colour";

                if (i % 3 == 0) {
                    elem.className += " third";
                }

                elem.style.backgroundColor = colour;
                elem.dataset.colour = colour;

                elem.addEventListener("click", () => {
                    selectColour(colour);
                })
                colourContainer.appendChild(elem);
        });
        var clear = document.createElement("div");
        clear.className = "clear";
        colourContainer.appendChild(clear);

        // Set up tools
        _.each(container.querySelectorAll(".tool"), (el) => {
            el.addEventListener("click", () => {
                selectTool(el.dataset.tool);
            })
        });


        gridCheckbox.addEventListener("change", drawOverlay);

        container.querySelector(".reset").addEventListener("click", () => {
            const rect = underCanvas.getBoundingClientRect();
            displayCanvasContext.clearRect(0, 0, rect.width, rect.height);
            canvasContext.clearRect(0, 0, width, height);
        });

        container.querySelector(".save").addEventListener("click", () => {
            canvas.toBlob((blob) => {
                closeUI();
                drawings[key] = window.URL.createObjectURL(blob);
                upload.uploadImage(key, blob);
                callback(drawings[key]);
            });
        });

        container.querySelector("h1").innerHTML = ui.parseText(title);
        container.querySelector("p").innerHTML = ui.parseText(instruction);

        canvas.width = width;
        canvas.height = height;


        pause.pause('drawing');
        container.style.display = "block";

        var mainContainer = container.querySelector(".main-container")

        var MAX_CANVAS_WIDTH = mainContainer.offsetWidth;

        if (tiled) {
            // We have a preview - need to leave space for preview
            MAX_CANVAS_WIDTH = mainContainer.offsetWidth - (50 + (width * 3));
            previewCanvas.width = width * 3;
            previewCanvas.height = height * 3;

            previewCanvas.style.left = (mainContainer.offsetWidth * 0.75) - (width * 1.5) + "px";
            previewCanvas.style.top = 60 + (MAX_CANVAS_HEIGHT / 2) - (height * 1.5) + "px";

            previewCanvas.style.display = "block";
        } else {
            previewCanvas.style.display = "none";
        }

        var rect = underCanvas.getBoundingClientRect();

        if (width > height) {
            pixelSize = Math.floor(MAX_CANVAS_WIDTH / width);
        } else {
            pixelSize = Math.floor(MAX_CANVAS_HEIGHT / height);
        }

        if (pixelSize * height > MAX_CANVAS_HEIGHT) {
            pixelSize = Math.floor(MAX_CANVAS_HEIGHT / height);   
        }

        // Set the width and height of the other three canvases
        underCanvas.width = width * pixelSize;
        underCanvas.height = height * pixelSize;
        displayCanvas.width = width * pixelSize;
        displayCanvas.height = height * pixelSize;
        overCanvas.width = width * pixelSize;
        overCanvas.height = height * pixelSize;

        var canvasContainer = container.querySelector(".canvas-container");


        // Center the canvases
        var centrePos = MAX_CANVAS_WIDTH / 2;
        var pos = centrePos - underCanvas.width / 2;
        canvasContainer.style.width = underCanvas.width + "px";
        canvasContainer.style.height = underCanvas.height + "px";
        canvasContainer.style.left = pos + "px";
        canvasContainer.style.top = (70 + (MAX_CANVAS_HEIGHT / 2 - (underCanvas.height / 2))) + "px";


        rect = underCanvas.getBoundingClientRect();

        // Draw the "transparent" indicator on under canvas

        // First clear it
        underCanvasContext.clearRect(0, 0, rect.width, rect.height);

        if (background != null) {
            // We have a background colour
            underCanvasContext.fillStyle = background;
            underCanvasContext.fillRect(0, 0, rect.width, rect.height);
            previewCanvasContext.fillStyle = background;
            previewCanvasContext.fillRect(0, 0, width * 3, height * 3);
        } else {
            // Draw the transparency grid
            var rowToggle = 0;
            const transparencyGridSize = 16;
            _.each(_.range(rect.width / transparencyGridSize), (x) => {
                var toggle = rowToggle;
                rowToggle += 1;
                if (rowToggle > 1) {
                    rowToggle = 0;
                }
                _.each(_.range(rect.height / transparencyGridSize), (y) => {
                    toggle += 1;
                    if (toggle > 1) {
                        toggle = 0;
                    }

                    underCanvasContext.fillStyle = transparentColours[toggle];
                    underCanvasContext.fillRect(x * transparencyGridSize, y * transparencyGridSize, transparencyGridSize, transparencyGridSize);
                });
            });
        }

        // Draw the guide if needed
        if (guide != null) {

            guideImage.onload = () => {
                var tmpCanvas = document.createElement('canvas');
                tmpCanvas.width = guideImage.width;
                tmpCanvas.height = guideImage.height;
                tmpCanvas.getContext('2d').drawImage(guideImage, 0, 0, guideImage.width, guideImage.height);
                var tmpContext = tmpCanvas.getContext('2d');
                underCanvasContext.fillStyle = "rgba(48,48,48, 0.8)";

                _.each(_.range(width), (x) => {
                    _.each(_.range(height), (y) => {
                        if (tmpContext.getImageData(x, y, 1, 1).data[3] > 0) {
                            // It's visible
                            underCanvasContext.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                        }
                    });
                });
            }
            guideImage.src = guide;
        }

        // Clear the display and drawing canvas
        displayCanvasContext.clearRect(0, 0, rect.width, rect.height);
        canvasContext.clearRect(0, 0, width, height);

        // Don't enable the grid by default
        container.querySelector(".show-grid").checked = false;

        // Draw the grid over the canvas
        drawOverlay();


        // Bind the canvas
        overCanvas.addEventListener("mousedown", (e) => {
            const up = () => {
                document.removeEventListener("mouseup", up);
                overCanvas.removeEventListener("mousemove", move);
            };

            const move = (e) => {
                const bounding = overCanvas.getBoundingClientRect();
                const x = e.clientX - bounding.left;
                const y = e.clientY - bounding.top;

                var realX = Math.floor(x / pixelSize);
                var realY = Math.floor(y / pixelSize);

                if (realX < 0) {
                    realX = 0;
                }

                if (realY < 0) {
                    realY = 0;
                }

                draw(realX, realY);
            }

            overCanvas.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
            move(e);
        });

        selectColour("#000001");
        selectTool("pencil");
    },

    close() {
        closeUI();
    }
}