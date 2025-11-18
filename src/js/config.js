// js/config.js

export const GRID_DIMENSIONS = { cols: 8, rows: 3 };

// Mapping of keyboard keys to grid cells (row-major order, 0-indexed)
// This is based on the QWERTY layout, trying to match the spirit of the spec's images
// but ensuring a consistent 8x3 grid.
export const KEY_MAPPING = [
    ['q', 'w', 'e', 'r', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'n', 'm', ',', '.'],
];

export const TARGET_IMAGE_SRC = '/img/background_image.jpg';

// New constants for randomizing target size
export const TARGET_SIZE_RATIO_MIN = 0.01; // 1% of screen width
export const TARGET_SIZE_RATIO_MAX = 0.05; // 5% of screen width

export const COLORS = {
    grid: 'rgba(255, 255, 255, 0.5)',
    targetBox: 'rgba(255, 165, 0, 1)',
    viewOutline: 'rgba(255, 0, 0, 1)',
    pointer: 'rgba(255, 165, 0, 0.8)',
    text: 'white',
    textHighlight: 'red',
};


export const CANVAS_WIDTH = 800; // Standard width for canvases
export const CANVAS_HEIGHT = 450; // Standard height for canvases (aspect ratio of the image)
