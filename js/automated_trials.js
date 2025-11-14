// js/automated_trials.js

import { createInitialState, processMove } from './simulation.js';
import { calculateGridCells } from './geometry.js';
import { GRID_DIMENSIONS } from './config.js';

const NUM_TRIALS = 1000;
// Define a fixed set of dimensions for headless testing.
// In a real scenario, this might come from loading the image dimensions,
// but for a headless script, a fixed, known value is reliable.
const FULL_DIMENSIONS = { w: 2560, h: 1600 };

/**
 * The "player" algorithm. It determines which grid cell to select next.
 * The strategy is to find the cell that contains the center of the target box.
 * @param {object} targetBox - The target box {x, y, w, h}.
 * @param {Array<object>} cells - The array of grid cells.
 * @returns {number} The index of the cell containing the target's center, or -1 if not found.
 */
function findTargetCell(targetBox, cells) {
    const targetCenter = {
        x: targetBox.x + targetBox.w / 2,
        y: targetBox.y + targetBox.h / 2,
    };

    for (const cell of cells) {
        if (
            targetCenter.x >= cell.x &&
            targetCenter.x < cell.x + cell.w &&
            targetCenter.y >= cell.y &&
            targetCenter.y < cell.y + cell.h
        ) {
            return cell.index;
        }
    }
    return -1; // Should not happen in a normal trial
}

/**
 * Runs a single, automated trial from start to finish.
 * @returns {number} The number of moves it took to complete the trial.
 */
function runSingleTrial() {
    const state = createInitialState(FULL_DIMENSIONS);
    state.gameState = 'RUNNING'; // Start the trial immediately

    while (state.gameState === 'RUNNING') {
        const cells = calculateGridCells(state.currentView);
        const targetCellIndex = findTargetCell(state.targetBox, cells);

        if (targetCellIndex === -1) {
            console.error("Error: Target center not found in any cell. Aborting trial.");
            return -1;
        }

        processMove(state, targetCellIndex);

        // Safety break to prevent infinite loops in case of logic errors
        if (state.trialStats.moves > 50) {
            console.error("Error: Trial exceeded 50 moves. Aborting.");
            break;
        }
    }

    return state.trialStats.moves;
}

/**
 * Main function to run all automated trials and collect the results.
 */
function runAllTrials() {
    console.log(`Running ${NUM_TRIALS} automated trials...`);
    const results = [];
    for (let i = 0; i < NUM_TRIALS; i++) {
        const moves = runSingleTrial();
        if (moves !== -1) {
            results.push({ trial: i + 1, moves });
        }
        // Simple progress indicator
        if ((i + 1) % 100 === 0) {
            console.log(`...completed ${i + 1} trials.`);
        }
    }
    console.log("All trials completed.");
    // The next epic will handle formatting and printing this data.
    console.log("Sample results:", results.slice(0, 10));
}

// --- Start the automated trials ---
runAllTrials();
