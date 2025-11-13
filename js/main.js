// js/main.js

import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    TARGET_IMAGE_SRC,
    KEY_MAPPING,
    GRID_DIMENSIONS,
    COLORS
} from './config.js';
import {
    drawTopPanel,
    drawBottomPanel,
    drawOverlayMessage
} from './renderer.js';
import {
    generateRandomTargetBox,
    getPointerPosition,
    isPointInRect,
    zoomToCell,
    calculateGridCells,
    calculateDistance, // Import new helper
    calculateDiagonal, // Import new helper
} from './geometry.js';

// --- State Management ---
const state = {
    gameState: 'IDLE', // 'IDLE', 'RUNNING', 'FINISHED'
    targetImage: new Image(),
    fullDimensions: {
        w: 0,
        h: 0
    }, // Actual dimensions of the loaded image
    currentView: null, // {x, y, w, h} - current zoomed area in image coordinates
    targetBox: null, // {x, y, w, h} - target box in image coordinates
    keyMap: {}, // Flattened KEY_MAPPING for easy lookup
    highlightedCellIndex: -1, // Index of the cell currently highlighted by key press
    initialPointerPosition: null, // Store {x, y} of pointer at trial start
    trialStats: {
        moves: 0,
        percentageMoved: 0, // New property for percentage moved
    },
    topCanvas: null,
    topCtx: null,
    bottomCanvas: null,
    bottomCtx: null,
};

// --- Initialization ---
function init() {
    state.topCanvas = document.getElementById('top-panel-canvas');
    state.bottomCanvas = document.getElementById('bottom-panel-canvas');

    if (!state.topCanvas || !state.bottomCanvas) {
        console.error("Canvas elements not found!");
        return;
    }

    state.topCtx = state.topCanvas.getContext('2d');
    state.bottomCtx = state.bottomCanvas.getContext('2d');

    // Set canvas dimensions
    state.topCanvas.width = CANVAS_WIDTH;
    state.topCanvas.height = CANVAS_HEIGHT;
    state.bottomCanvas.width = CANVAS_WIDTH;
    state.bottomCanvas.height = CANVAS_HEIGHT;

    // Flatten KEY_MAPPING for quick lookup
    state.keyMap = KEY_MAPPING.flat();

    // Load the target image
    state.targetImage.src = TARGET_IMAGE_SRC;
    state.targetImage.onload = () => {
        state.fullDimensions.w = state.targetImage.naturalWidth;
        state.fullDimensions.h = state.targetImage.naturalHeight;
        resetTrial(); // Initialize currentView and targetBox after image loads
        requestAnimationFrame(gameLoop);
    };
    state.targetImage.onerror = () => {
        console.error("Failed to load image:", TARGET_IMAGE_SRC);
        // Draw error message on canvases
        state.topCtx.fillStyle = 'red';
        state.topCtx.fillText('Error loading image!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        state.bottomCtx.fillStyle = 'red';
        state.bottomCtx.fillText('Error loading image!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    };

    // Event Listeners
    window.addEventListener('keydown', handleKeyDown);
}

// --- Game Loop ---
function gameLoop() {
    drawBottomPanel(state.bottomCtx, state);
    drawTopPanel(state.topCtx, state);
    requestAnimationFrame(gameLoop);
}

// --- Event Handlers ---
function handleKeyDown(event) {
    const key = event.key.toLowerCase();

    if (state.gameState === 'IDLE') {
        if (key === ' ') {
            event.preventDefault(); // Prevent page scroll
            state.gameState = 'RUNNING';
        }
    } else if (state.gameState === 'FINISHED') {
        if (key === ' ') {
            event.preventDefault(); // Prevent page scroll
            resetTrial();
            state.gameState = 'RUNNING';
        }
    } else if (state.gameState === 'RUNNING') {
        const cellIndex = state.keyMap.indexOf(key);
        if (cellIndex !== -1) {
            event.preventDefault(); // Prevent default key action
            state.trialStats.moves++;
            state.highlightedCellIndex = cellIndex; // Highlight the selected cell

            // Simulate a brief flash for UI feedback
            setTimeout(() => {
                state.highlightedCellIndex = -1; // Remove highlight
            }, 150);

            // Zoom into the selected cell
            state.currentView = zoomToCell(state.currentView, cellIndex);

            // Check for win condition
            const pointer = getPointerPosition(state.currentView);
            if (isPointInRect(pointer, state.targetBox)) {
                state.gameState = 'FINISHED';
                const endPointer = getPointerPosition(state.currentView);
                const distance = calculateDistance(state.initialPointerPosition, endPointer);
                const fullDiagonal = calculateDiagonal(state.fullDimensions);
                state.trialStats.percentageMoved = (distance / fullDiagonal) * 100;
            }
        }
    }
}

// --- Helper Functions ---
function resetTrial() {
    state.gameState = 'IDLE'; // Will be set to RUNNING by handleKeyDown
    state.trialStats.moves = 0;
    state.trialStats.percentageMoved = 0; // Reset percentage for new trial
    state.highlightedCellIndex = -1;

    // Initial view is the full image
    state.currentView = {
        x: 0,
        y: 0,
        w: state.fullDimensions.w,
        h: state.fullDimensions.h
    };
    state.initialPointerPosition = getPointerPosition(state.currentView); // Store initial pointer position

    // Generate a new random target box
    state.targetBox = generateRandomTargetBox(state.fullDimensions);
}

// --- Start the application ---
document.addEventListener('DOMContentLoaded', init);
