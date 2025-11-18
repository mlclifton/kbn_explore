// js/tests/simulation.test.js

import assert from 'assert';
import { createInitialState, processMove } from '../simulation.js';
import { isPointInRect, getPointerPosition } from '../geometry.js';

// --- Test Suite ---

function runTest(testName, testFunction) {
    try {
        testFunction();
        console.log(`✅ PASSED: ${testName}`);
    } catch (error) {
        console.error(`❌ FAILED: ${testName}`);
        console.error(error);
        process.exit(1); // Exit with error code on failure
    }
}

// --- Tests ---

runTest('createInitialState: should create a valid initial state', () => {
    const fullDimensions = { w: 1000, h: 800 };
    const state = createInitialState(fullDimensions);

    assert.strictEqual(state.gameState, 'IDLE', 'gameState should be IDLE');
    assert.deepStrictEqual(state.fullDimensions, fullDimensions, 'fullDimensions should be set');
    assert.deepStrictEqual(state.currentView, { x: 0, y: 0, ...fullDimensions }, 'currentView should be full dimensions');
    assert.ok(state.targetBox, 'targetBox should be generated');
    assert.strictEqual(state.trialStats.moves, 0, 'moves should be 0');
    assert.strictEqual(state.viewHistory.length, 1, 'viewHistory should have one entry');
});

runTest('processMove: should increment moves and change view', () => {
    const fullDimensions = { w: 2560, h: 1600 };
    const state = createInitialState(fullDimensions);
    state.gameState = 'RUNNING';

    const initialView = { ...state.currentView };
    const initialMoves = state.trialStats.moves;

    processMove(state, 10); // Zoom into cell 10 (an arbitrary choice)

    assert.strictEqual(state.trialStats.moves, initialMoves + 1, 'moves should increment by 1');
    assert.notDeepStrictEqual(state.currentView, initialView, 'currentView should have changed');
    assert.ok(state.currentView.w < initialView.w, 'currentView width should decrease');
    assert.ok(state.currentView.h < initialView.h, 'currentView height should decrease');
    assert.strictEqual(state.viewHistory.length, 2, 'viewHistory should have two entries');
});

runTest('processMove: should correctly identify a win condition', () => {
    const fullDimensions = { w: 2560, h: 1600 };
    const state = createInitialState(fullDimensions);
    state.gameState = 'RUNNING';

    // Set the target to be the entire area. Any zoom will result in the pointer
    // being within the target box, guaranteeing a win.
    state.targetBox = { x: 0, y: 0, w: fullDimensions.w, h: fullDimensions.h };

    // Process a move. This should now trigger the win condition.
    processMove(state, 0);

    assert.strictEqual(state.gameState, 'FINISHED', 'gameState should be FINISHED after a winning move');
});


console.log('\nAll simulation tests completed.');
