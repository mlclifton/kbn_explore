// js/main.js

import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    TARGET_IMAGE_SRC,
    KEY_MAPPING,
} from './config.js';
import {
    drawTopPanel,
    drawBottomPanel
} from './renderer.js';
import {
    createInitialState,
    resetTrial,
    processMove,
    processUndo
} from './simulation.js';

// --- State Management ---
// The primary state is now managed by the simulation module.
// This object holds state specific to the browser-based renderer.
const renderState = {
    targetImage: new Image(),
    keyMap: {}, // Flattened KEY_MAPPING for easy lookup
    highlightedCellIndex: -1, // Index of the cell currently highlighted by key press
    topCanvas: null,
    topCtx: null,
    bottomCanvas: null,
    bottomCtx: null,
};

// This will hold the core simulation state
let simState = null;


// --- Initialization ---
function init() {
    renderState.topCanvas = document.getElementById('top-panel-canvas');
    renderState.bottomCanvas = document.getElementById('bottom-panel-canvas');

    if (!renderState.topCanvas || !renderState.bottomCanvas) {
        console.error("Canvas elements not found!");
        return;
    }

    renderState.topCtx = renderState.topCanvas.getContext('2d');
    renderState.bottomCtx = renderState.bottomCanvas.getContext('2d');

    // Set canvas dimensions
    renderState.topCanvas.width = CANVAS_WIDTH;
    renderState.topCanvas.height = CANVAS_HEIGHT;
    renderState.bottomCanvas.width = CANVAS_WIDTH;
    renderState.bottomCanvas.height = CANVAS_HEIGHT;

    // Flatten KEY_MAPPING for quick lookup
    renderState.keyMap = KEY_MAPPING.flat();

    // Load the target image
    renderState.targetImage.src = TARGET_IMAGE_SRC;
    renderState.targetImage.onload = () => {
        const fullDimensions = {
            w: renderState.targetImage.naturalWidth,
            h: renderState.targetImage.naturalHeight,
        };
        // Create the initial simulation state
        simState = createInitialState(fullDimensions);
        requestAnimationFrame(gameLoop);
    };
    renderState.targetImage.onerror = () => {
        console.error("Failed to load image:", TARGET_IMAGE_SRC);
        // Draw error message on canvases
        renderState.topCtx.fillStyle = 'red';
        renderState.topCtx.fillText('Error loading image!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        renderState.bottomCtx.fillStyle = 'red';
        renderState.bottomCtx.fillText('Error loading image!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    };

    // Event Listeners
    window.addEventListener('keydown', handleKeyDown);
}

// --- Game Loop ---
function gameLoop() {
    // Pass both the simulation state and render-specific state to the drawing functions
    const combinedState = { ...simState, ...renderState };
    drawBottomPanel(renderState.bottomCtx, combinedState);
    drawTopPanel(renderState.topCtx, combinedState);
    requestAnimationFrame(gameLoop);
}

// --- Event Handlers ---
function handleKeyDown(event) {
    if (!simState) return; // Don't handle keys if simulation hasn't started

    const key = event.key.toLowerCase();

    if (simState.gameState === 'IDLE') {
        if (key === ' ') {
            event.preventDefault(); // Prevent page scroll
            simState.gameState = 'RUNNING';
        }
    } else if (simState.gameState === 'FINISHED') {
        if (key === ' ') {
            event.preventDefault(); // Prevent page scroll
            resetTrial(simState);
            simState.gameState = 'RUNNING';
        }
    } else if (simState.gameState === 'RUNNING') {
        event.preventDefault(); // Prevent default browser actions for keys during trial

        if (key === 'escape') {
            // UNDO LOGIC
            processUndo(simState);
        } else {
            // ZOOM LOGIC
            const cellIndex = renderState.keyMap.indexOf(key);
            if (cellIndex !== -1) {
                renderState.highlightedCellIndex = cellIndex; // Highlight the selected cell

                // Simulate a brief flash for UI feedback
                setTimeout(() => {
                    renderState.highlightedCellIndex = -1; // Remove highlight
                }, 150);

                // Process the move via the simulation module
                processMove(simState, cellIndex);
            }
        }
    }
}

// --- Start the application ---
document.addEventListener('DOMContentLoaded', init);
