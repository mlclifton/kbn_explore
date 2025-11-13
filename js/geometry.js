// js/geometry.js

import { GRID_DIMENSIONS } from './config.js';

/**
 * Calculates the bounding rectangles for each cell in a grid overlaid on a given view.
 * @param {object} view - The current view area {x, y, w, h}.
 * @returns {Array<object>} An array of cell rectangles {x, y, w, h}.
 */
export function calculateGridCells(view) {
    const { cols, rows } = GRID_DIMENSIONS;
    const cellWidth = view.w / cols;
    const cellHeight = view.h / rows;
    const cells = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            cells.push({
                x: view.x + c * cellWidth,
                y: view.y + r * cellHeight,
                w: cellWidth,
                h: cellHeight,
                col: c,
                row: r,
                index: r * cols + c // 0-indexed flat index
            });
        }
    }
    return cells;
}

/**
 * Calculates the center point of a given view, representing the "pointer" tip.
 * @param {object} view - The current view area {x, y, w, h}.
 * @returns {object} The center point {x, y}.
 */
export function getPointerPosition(view) {
    return {
        x: view.x + view.w / 2,
        y: view.y + view.h / 2
    };
}

/**
 * Checks if a point is within a rectangle.
 * @param {object} point - The point {x, y}.
 * @param {object} rect - The rectangle {x, y, w, h}.
 * @returns {boolean} True if the point is inside the rectangle, false otherwise.
 */
export function isPointInRect(point, rect) {
    return point.x >= rect.x &&
           point.x <= rect.x + rect.w &&
           point.y >= rect.y &&
           point.y <= rect.y + rect.h;
}

/**
 * Calculates the new view area after zooming into a specific grid cell.
 * @param {object} currentView - The current view area {x, y, w, h}.
 * @param {number} cellIndex - The 0-indexed flat index of the selected cell.
 * @returns {object} The new view area {x, y, w, h}.
 */
export function zoomToCell(currentView, cellIndex) {
    const cells = calculateGridCells(currentView);
    const selectedCell = cells[cellIndex];

    if (!selectedCell) {
        console.error("Invalid cell index for zoom:", cellIndex);
        return currentView; // Return current view if index is invalid
    }

    const originalAspectRatio = currentView.w / currentView.h;

    const newH = selectedCell.h;
    const newW = newH * originalAspectRatio;

    const cellCenterX = selectedCell.x + selectedCell.w / 2;
    
    const newX = cellCenterX - newW / 2;
    const newY = selectedCell.y;

    return { x: newX, y: newY, w: newW, h: newH };
}

/**
 * Calculates the Euclidean distance between two points.
 * @param {object} p1 - The first point {x, y}.
 * @param {object} p2 - The second point {x, y}.
 * @returns {number} The distance between the two points.
 */
export function calculateDistance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the diagonal length of a rectangle.
 * @param {object} dimensions - The rectangle's dimensions {w, h}.
 * @returns {number} The diagonal length.
 */
export function calculateDiagonal(dimensions) {
    return Math.sqrt(dimensions.w * dimensions.w + dimensions.h * dimensions.h);
}

/**
 * Generates a random target box within the full image dimensions.
 * @param {object} fullDimensions - The full dimensions of the image {w, h}.
 * @param {number} minSizeRatio - Minimum size of the target box as a ratio of full dimension.
 * @param {number} maxSizeRatio - Maximum size of the target box as a ratio of full dimension.
 * @returns {object} The random target box {x, y, w, h}.
 */
export function generateRandomTargetBox(fullDimensions) {
    const sizeRatio = 0.02; // Fixed 2% size ratio, as requested
    const size = fullDimensions.w * sizeRatio;

    const targetW = size;
    const targetH = size;

    const x = Math.random() * (fullDimensions.w - targetW);
    const y = Math.random() * (fullDimensions.h - targetH);

    return { x, y, w: targetW, h: targetH };
}
