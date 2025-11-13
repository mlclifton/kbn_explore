// js/renderer.js

import { COLORS, GRID_DIMENSIONS, CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { calculateGridCells, getPointerPosition } from './geometry.js';

/**
 * Clears a canvas context.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 */
function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Draws the bottom panel, showing the full image, the target box, and the current view outline.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the bottom canvas.
 * @param {object} state - The current application state.
 */
export function drawBottomPanel(ctx, state) {
    clearCanvas(ctx);

    if (!state.targetImage || !state.targetImage.complete) {
        // Draw a placeholder if image is not loaded
        ctx.fillStyle = '#555';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = COLORS.text;
        ctx.textAlign = 'center';
        ctx.fillText('Loading Image...', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }

    // Draw the full target image scaled to fit the canvas
    ctx.drawImage(state.targetImage, 0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw the target box (orange)
    if (state.targetBox) {
        // Scale targetBox coordinates from full image dimensions to canvas dimensions
        const scaleX = ctx.canvas.width / state.fullDimensions.w;
        const scaleY = ctx.canvas.height / state.fullDimensions.h;

        ctx.strokeStyle = COLORS.targetBox;
        ctx.lineWidth = 3;
        ctx.strokeRect(
            state.targetBox.x * scaleX,
            state.targetBox.y * scaleY,
            state.targetBox.w * scaleX,
            state.targetBox.h * scaleY
        );
    }

    // Draw the current view outline (red), but only when the trial is running
    if (state.currentView && state.gameState !== 'IDLE') {
        // Scale currentView coordinates from full image dimensions to canvas dimensions
        const scaleX = ctx.canvas.width / state.fullDimensions.w;
        const scaleY = ctx.canvas.height / state.fullDimensions.h;

        ctx.strokeStyle = COLORS.viewOutline;
        ctx.lineWidth = 2;
        ctx.strokeRect(
            state.currentView.x * scaleX,
            state.currentView.y * scaleY,
            state.currentView.w * scaleX,
            state.currentView.h * scaleY
        );
    }

    // Draw the pointer tip (orange circle)
    if (state.currentView) {
        const pointer = getPointerPosition(state.currentView);
        const scaleX = ctx.canvas.width / state.fullDimensions.w;
        const scaleY = ctx.canvas.height / state.fullDimensions.h;

        ctx.fillStyle = COLORS.pointer;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pointer.x * scaleX, pointer.y * scaleY, 10, 0, Math.PI * 2); // 10px radius
        ctx.fill();
        ctx.stroke();
    }
}

/**
 * Draws the top panel, showing the zoomed-in view, grid, and messages.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the top canvas.
 * @param {object} state - The current application state.
 */
export function drawTopPanel(ctx, state) {
    clearCanvas(ctx);

    if (!state.targetImage || !state.targetImage.complete) {
        ctx.fillStyle = '#555';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = COLORS.text;
        ctx.textAlign = 'center';
        ctx.fillText('Loading Image...', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }

    if (state.gameState === 'IDLE') {
        ctx.fillStyle = '#888'; // Grey background for idle state
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawOverlayMessage(ctx, 'hit space to start');
    } else if (state.gameState === 'RUNNING') {
        // Draw the zoomed-in portion of the image
        ctx.drawImage(
            state.targetImage,
            state.currentView.x,
            state.currentView.y,
            state.currentView.w,
            state.currentView.h,
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        // Draw the grid
        const cells = calculateGridCells({ x: 0, y: 0, w: ctx.canvas.width, h: ctx.canvas.height });
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        cells.forEach((cell, index) => {
            ctx.strokeRect(cell.x, cell.y, cell.w, cell.h);

            // Draw key labels
            const key = state.keyMap[index];
            if (key) {
                ctx.fillStyle = (state.highlightedCellIndex === index) ? COLORS.textHighlight : COLORS.text;
                ctx.fillText(key.toUpperCase(), cell.x + cell.w / 2, cell.y + cell.h / 2);
            }
        });

        // Draw the target box, translated to the current view
        if (state.targetBox) {
            const view = state.currentView;
            const target = state.targetBox;
            const scaleX = ctx.canvas.width / view.w;
            const scaleY = ctx.canvas.height / view.h;

            const drawX = (target.x - view.x) * scaleX;
            const drawY = (target.y - view.y) * scaleY;
            const drawW = target.w * scaleX;
            const drawH = target.h * scaleY;

            ctx.strokeStyle = COLORS.targetBox;
            ctx.lineWidth = 3;
            ctx.strokeRect(drawX, drawY, drawW, drawH);
        }

        // Draw the pointer in the center of the top canvas
        ctx.fillStyle = COLORS.pointer;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, 10, 0, Math.PI * 2); // 10px radius
        ctx.fill();
        ctx.stroke();

    } else if (state.gameState === 'FINISHED') {
        ctx.fillStyle = '#888'; // Grey background for finished state
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawOverlayMessage(ctx,
            `The pointer moved X% of the target area during the trial and took ${state.trialStats.moves} moves.\n\npress space to start another trial.`
            // TODO: Calculate actual percentage moved
        );
    }
}

/**
 * Draws an overlay message on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
 * @param {string} message - The message to display.
 */
export function drawOverlayMessage(ctx, message) {
    ctx.fillStyle = COLORS.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '30px Arial';

    const lines = message.split('\n');
    const lineHeight = 35; // Adjust as needed
    let y = ctx.canvas.height / 2 - (lines.length - 1) * lineHeight / 2;

    lines.forEach(line => {
        ctx.fillText(line, ctx.canvas.width / 2, y);
        y += lineHeight;
    });
}
