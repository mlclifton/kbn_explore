# Technical Solution Design: Keyboard-Based Iterative Zoom Navigation

## 1. Overview

This document outlines the technical design for the "Keyboard-Based Iterative Zoom Navigation" project, as described in the functional specification. The goal of this initial phase is to develop an interactive web-based simulation to test the core concept and "feel" of the navigation system.

The design prioritizes simplicity, modularity, and rapid development, using standard web technologies to create a functional prototype.

## 2. Technology Stack

For the initial simulation, a lightweight, client-side-only stack is proposed. This avoids the need for complex build tooling or server-side infrastructure.

-   **Runtime:** Modern Web Browser
-   **Languages:**
    -   **HTML5:** For the application's structure.
    -   **CSS3:** For styling and layout of the UI panels.
    -   **JavaScript (ES6+):** For all application logic, state management, and rendering.
-   **Graphics:** The **HTML5 Canvas API** will be used for all dynamic drawing, including rendering the image, grid overlays, target boxes, and pointers. This provides the flexibility and performance needed for the interactive zoom and drawing operations.

No external frameworks (like React or Vue) are deemed necessary for this initial phase, but the modular design will allow for their integration later if required.

## 3. Application Architecture

### 3.1. File Structure

The project will be organized into a clear and simple file structure:

```
kbn_explore/
├── docs/
│   └── functional_spec.pdf
├── img/
│   └── target_image.jpg  // Placeholder for the main target image
├── js/
│   ├── main.js           // Main application controller, state, and game loop
│   ├── renderer.js       // All Canvas drawing logic
│   ├── geometry.js       // Geometric calculations (grid, zoom, collision)
│   └── config.js         // Application constants (grid size, keys, colors)
├── index.html            // Main HTML entry point
├── style.css             // CSS for layout and styling
└── TECHNICAL_SOLUTION_DESIGN.md // This file
```

### 3.2. Core Components (HTML)

The `index.html` file will define the basic page structure, including the two main canvas elements that comprise the UI.

-   **Top Panel:** `<canvas id="top-panel-canvas"></canvas>`
    -   Renders the zoomed-in view of the current target area.
    -   Displays the interactive grid overlay with key labels.
    -   Shows the "Press Space to Start" and final summary messages.
-   **Bottom Panel:** `<canvas id="bottom-panel-canvas"></canvas>`
    -   Renders the full, static view of the entire target image.
    -   Displays the red outline indicating the current zoom area's position relative to the whole.
    -   Displays the randomly placed orange target box for the trial.

### 3.3. State Management

A single JavaScript object in `main.js` will manage the entire application state.

```javascript
// Example State Object in main.js
const state = {
    gameState: 'IDLE', // 'IDLE', 'RUNNING', 'FINISHED'
    targetImage: null, // The loaded image object
    fullDimensions: { w: 0, h: 0 }, // Dimensions of the full target area
    // The current area being viewed in the top panel, relative to fullDimensions
    currentView: { x: 0, y: 0, w: 0, h: 0 },
    // The destination box for the trial, relative to fullDimensions
    targetBox: { x: 0, y: 0, w: 0, h: 0 },
    moveHistory: [], // Array of keys pressed during the trial
    trialStats: {
        moves: 0,
        initialDistance: 0,
    }
};
```

## 4. Core Modules & Logic

### 4.1. `config.js` (Configuration)

This file will export constants to make the application easy to configure.

```javascript
export const GRID_DIMENSIONS = { cols: 8, rows: 3 };
export const KEY_MAPPING = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'l']
];
export const COLORS = {
    grid: 'rgba(255, 255, 255, 0.5)',
    targetBox: 'rgba(255, 165, 0, 1)',
    viewOutline: 'rgba(255, 0, 0, 1)',
    // ... other colors
};
export const TARGET_IMAGE_SRC = 'img/target_image.jpg';
```

### 4.2. `geometry.js` (Geometric Helpers)

This module will contain pure functions for geometric calculations.

-   `calculateGridCells(view)`: Takes the `currentView` rectangle and returns an array of 24 smaller rectangle objects representing the grid cells.
-   `getPointerPosition(view)`: Returns the `{x, y}` coordinates of the center of the `currentView`. This represents the tip of the user's pointer.
-   `isPointInRect(point, rect)`: Checks if a point is inside a rectangle. Used for the win condition.
-   `zoomToCell(view, cellIndex)`: Calculates the new `currentView` rectangle based on the selected grid cell index.

### 4.3. `renderer.js` (Graphics Engine)

This module will handle all drawing on the canvases. It will import the state and configuration to render the current frame.

-   `drawTopPanel(ctx, state)`:
    1.  Clears the canvas.
    2.  If `state.gameState === 'RUNNING'`, it draws the portion of the `targetImage` corresponding to `state.currentView`.
    3.  Draws the grid lines and key labels over the top.
    4.  Handles drawing UI feedback, like flashing a selected cell.
-   `drawBottomPanel(ctx, state)`:
    1.  Draws the entire `targetImage`.
    2.  Draws the `state.targetBox` (the orange destination).
    3.  Draws a red rectangle representing the bounds of `state.currentView`.
-   `drawOverlayMessage(ctx, message)`: Renders text overlays like "hit space to start" or the final summary.

### 4.4. `main.js` (Application Controller)

This is the central hub of the application.

-   **Initialization (`init`)**:
    -   Gets canvas contexts.
    -   Loads the target image.
    -   Sets up the main `update` loop using `requestAnimationFrame`.
    -   Attaches keyboard event listeners (`keydown`).
-   **Game Loop (`update`)**:
    -   Called on every frame.
    -   Calls the appropriate rendering functions from `renderer.js` based on the `gameState`.
-   **Event Handling (`handleKeyDown`)**:
    -   Implements the primary state machine.
    -   **If `gameState` is `IDLE` or `FINISHED`**: Listens for the `Space` key to start/restart a trial. When triggered, it resets the state, generates a random `targetBox`, and sets `gameState` to `RUNNING`.
    -   **If `gameState` is `RUNNING`**:
        -   Listens for one of the keys in `KEY_MAPPING`.
        -   On a valid key press:
            1.  Finds the corresponding grid cell.
            2.  Uses `geometry.zoomToCell` to calculate the new `currentView`.
            3.  Updates `state.moveHistory` and `state.trialStats`.
            4.  Checks for the win condition (`isPointInRect(getPointerPosition(state.currentView), state.targetBox)`).
            5.  If won, changes `gameState` to `FINISHED`.

## 5. Phase 1 Implementation Plan

1.  **Setup:** Create the file structure and boilerplate HTML/CSS.
2.  **Initial Render:** Implement `main.js` and `renderer.js` to load the `target_image.jpg` and display it in the bottom panel, with a grey top panel.
3.  **Start Trial:** Implement the `IDLE` -> `RUNNING` state transition on `Space` press. This includes generating and drawing the random `targetBox` on the bottom panel.
4.  **Grid & Zoom:**
    -   Implement `config.js` with the key mappings.
    -   Implement `geometry.js` to calculate the grid and the new view on zoom.
    -   Update `renderer.js` to draw the grid and the zoomed view in the top panel.
5.  **Interaction:** Tie the key-press event to the zoom logic. Update the state and re-render on each valid key press.
6.  **Win Condition:** Implement the win condition check in the main loop and transition to the `FINISHED` state.
7.  **Summary:** Display the trial summary message when the `FINISHED` state is reached.
8.  **Refinement:** Polish UI feedback (e.g., cell flashing) and ensure the "feel" is right.

## 6. Future Considerations

This design provides a solid foundation for subsequent project phases:

-   **Phase 2 (Automated Trials):** The core logic in `geometry.js` and the state management in `main.js` can be decoupled from the `renderer.js`. A separate script can be written to run trials headlessly, simply by manipulating the state and calling the geometric functions, recording the results without any UI.
-   **Phase 3 (Analysis):** The data from the automated trials can be easily logged to the console or formatted as JSON/CSV for external analysis.
-   **Phase 5 (Production Build):** The core simulation logic is self-contained. It can be integrated into a larger application or framework (like React) by treating the simulation as a component and feeding state into it via props.
