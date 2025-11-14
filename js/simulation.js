// js/simulation.js

import {
    generateRandomTargetBox,
    getPointerPosition,
    isPointInRect,
    zoomToCell,
    calculateDistance,
    calculateDiagonal,
} from './geometry.js';

/**
 * Creates and returns an initial state object for a new simulation.
 * @param {object} fullDimensions - The dimensions of the full image {w, h}.
 * @returns {object} A new state object.
 */
export function createInitialState(fullDimensions) {
    const initialState = {
        gameState: 'IDLE', // 'IDLE', 'RUNNING', 'FINISHED'
        fullDimensions: { ...fullDimensions },
        currentView: { x: 0, y: 0, w: fullDimensions.w, h: fullDimensions.h },
        targetBox: generateRandomTargetBox(fullDimensions),
        viewHistory: [],
        trialStats: {
            moves: 0,
            percentageMoved: 0,
        },
    };
    initialState.viewHistory = [initialState.currentView];
    return initialState;
}

/**
 * Resets the state for a new trial.
 * @param {object} state - The current application state.
 */
export function resetTrial(state) {
    const newState = createInitialState(state.fullDimensions);
    // Overwrite the properties of the existing state object
    Object.assign(state, newState);
    state.gameState = 'IDLE'; // Set to IDLE, keydown handler will start it
}

/**
 * Processes a single move/zoom action.
 * @param {object} state - The current application state.
 * @param {number} cellIndex - The index of the grid cell to zoom into.
 * @returns {boolean} True if the move resulted in a win, false otherwise.
 */
export function processMove(state, cellIndex) {
    state.trialStats.moves++;

    const newView = zoomToCell(state.currentView, cellIndex);
    state.viewHistory.push(newView);
    state.currentView = newView;

    const pointer = getPointerPosition(state.currentView);
    if (isPointInRect(pointer, state.targetBox)) {
        state.gameState = 'FINISHED';
        // Calculate final stats
        const initialPointerPosition = getPointerPosition(state.viewHistory[0]);
        const endPointer = getPointerPosition(state.currentView);
        const distance = calculateDistance(initialPointerPosition, endPointer);
        const fullDiagonal = calculateDiagonal(state.fullDimensions);
        state.trialStats.percentageMoved = (distance / fullDiagonal) * 100;
        return true; // Win
    }
    return false; // No win
}

/**
 * Processes an undo action.
 * @param {object} state - The current application state.
 */
export function processUndo(state) {
    if (state.viewHistory.length > 1) {
        state.viewHistory.pop();
        state.currentView = state.viewHistory[state.viewHistory.length - 1];
        state.trialStats.moves--;
    }
}
