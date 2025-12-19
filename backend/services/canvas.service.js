const { createCanvas, loadImage } = require('canvas');

const canvases = [];

function createNewCanvas(id, width, height) {
    const canvas = createCanvas(width, height);
    canvases[id] = { canvas, elements: [] };
}

function getCanvas(id) {
    return canvases[id];
}

function deleteCanvas(id) {
    delete canvases[id];
}

module.exports = {
    canvases,
    createNewCanvas,
    getCanvas,
    deleteCanvas
};