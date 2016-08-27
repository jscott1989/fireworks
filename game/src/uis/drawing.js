/**
 * The drawing UI
 */
 import _ from "lodash";
 require("floodfill");

var container;

var selectedColour;
var selectedTool;


const tools = {
    pencil(x, y) {
        canvasContext.fillStyle = selectedColour;
        canvasContext.fillRect( x, y, 1, 1 );

        displayCanvasContext.fillStyle = selectedColour;
        displayCanvasContext.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    },

    brush(x, y) {
        canvasContext.fillStyle = selectedColour;
        canvasContext.fillRect( x - 1, y, 3, 1 );
        canvasContext.fillRect( x, y - 1, 1, 3 );

        displayCanvasContext.fillStyle = selectedColour;
        displayCanvasContext.fillRect((x - 1) * pixelSize, y * pixelSize, pixelSize * 3, pixelSize);
        displayCanvasContext.fillRect(x * pixelSize, (y - 1) * pixelSize, pixelSize, pixelSize * 3);
    },

    fill(x, y) {
        canvasContext.fillStyle = selectedColour;
        canvasContext.fillFlood(x, y);

        displayCanvasContext.fillStyle = selectedColour;
        displayCanvasContext.fillFlood(x * pixelSize, y * pixelSize);
    },

    eraser(x, y) {
        canvasContext.clearRect( x, y, 1, 1 );
        displayCanvasContext.clearRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
}

// Configuration
const transparentColours = [
    "#8C8C8C", "#F0F0F0"
];

const MAX_CANVAS_WIDTH = 600;
const MAX_CANVAS_HEIGHT = 350;


var pixelSize;

// On-screen elements
var overCanvas;
var overCanvasContext;
var displayCanvas;
var displayCanvasContext;
var underCanvas;
var underCanvasContext;
var gridCheckbox;

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
    container.style.display = "none";
    game.paused = false;
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
    open(width, height, guide, callback) {
        if (container == null) {
            container = document.getElementById("drawing-ui");
            overCanvas = container.querySelector(".over-canvas");
            overCanvasContext = overCanvas.getContext('2d');
            underCanvas = container.querySelector(".under-canvas");
            underCanvasContext = underCanvas.getContext('2d');
            displayCanvas = container.querySelector(".display-canvas");
            displayCanvasContext = displayCanvas.getContext('2d');
            gridCheckbox = container.querySelector(".show-grid");

            // Create colours
            const colourContainer = container.querySelector(".colours");
            _.each([
                    "#FFF",
                    "#000",
                    "#F00",
                    "#0F0",
                    "#00F",
                    "#FF0",
                    "#0FF",
                    "#F0F",
                    "#012",
                    "#234",
                    "#456",
                    "#678",
                    "#89A",
                    "#BCD",
                    "#CDE",
                    "#DEF",
                    "#F12",
                    "#F34",
                    "#EEE",
                    "#DDD",
                    "#AAA"
                ], (colour) => {
                    const elem = document.createElement("div");
                    elem.className = "colour";
                    elem.style.backgroundColor = colour;
                    elem.dataset.colour = colour;

                    elem.addEventListener("click", () => {
                        selectColour(colour);
                    })
                    colourContainer.appendChild(elem);
            });

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
                    callback(window.URL.createObjectURL(blob));
                    closeUI();
                });
            });
        }

        canvas.width = width;
        canvas.height = height;


        game.paused = true;
        container.style.display = "block";

        var rect = underCanvas.getBoundingClientRect();

        if (width > height) {
            pixelSize = Math.floor(MAX_CANVAS_WIDTH / width);
        } else {
            pixelSize = Math.floor(MAX_CANVAS_HEIGHT / height);
        }

        // Set the width and height of the other three canvases
        underCanvas.width = width * pixelSize;
        underCanvas.height = height * pixelSize;
        displayCanvas.width = width * pixelSize;
        displayCanvas.height = height * pixelSize;
        overCanvas.width = width * pixelSize;
        overCanvas.height = height * pixelSize;

        rect = underCanvas.getBoundingClientRect();

        // Draw the "transparent" indicator on under canvas

        // First clear it
        underCanvasContext.clearRect(0, 0, rect.width, rect.height);

        const transparencyGridSize = 16;
        var toggle = 0;
        _.each(_.range(rect.width / transparencyGridSize), (x) => {
            _.each(_.range(rect.height / transparencyGridSize), (y) => {
                toggle += 1;
                if (toggle > 1) {
                    toggle = 0;
                }

                underCanvasContext.fillStyle = transparentColours[toggle];
                underCanvasContext.fillRect(x * transparencyGridSize, y * transparencyGridSize, transparencyGridSize, transparencyGridSize);
            });
            toggle += 1;
            if (toggle > 1) {
                toggle = 0;
            }
        });

        // Clear the display and drawing canvas
        displayCanvasContext.clearRect(0, 0, rect.width, rect.height);
        canvasContext.clearRect(0, 0, width, height);

        // Don't enable the grid by default for large images (too hard to see)
        container.querySelector(".show-grid").checked = (width <= 32 && height <= 32);

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

        selectColour("#000");
        selectTool("pencil");
    },

    close() {
        closeUI();
    }
}