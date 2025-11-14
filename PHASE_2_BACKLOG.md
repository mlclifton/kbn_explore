# Phase 2 Backlog: Automated Trials

This backlog outlines the specific tasks required to implement the automated trial system.

### 1. Code Refactoring & Logic Isolation

-   [x] **Task:** Analyze `main.js` to identify all logic that can be decoupled from the browser environment (e.g., state management, trial lifecycle).
-   [x] **Task:** Create a new file `js/simulation.js` to house the core, environment-agnostic simulation logic.
-   [x] **Task:** Move the state initialization, trial start/end logic, and win condition checks from `main.js` into `js/simulation.js`.
-   [x] **Task:** Ensure all functions in `geometry.js` are pure and contain no DOM-related code.
-   [x] **Task:** Refactor `main.js` to import and use the new `js/simulation.js` module, confirming that the interactive browser simulation remains fully functional.

### 2. Automated Trial Runner Implementation

-   [ ] **Task:** Create the new file `js/automated_trials.js`.
-   [ ] **Task:** In `js/automated_trials.js`, import the necessary functions from `js/simulation.js`, `js/geometry.js`, and `js/config.js`.
-   [ ] **Task:** Implement the main "runner" function that loops for a specified number of trials (e.g., 1000).
-   [ ] **Task:** Create the "player" algorithm: a function that takes the current view and target box, and returns the index of the grid cell containing the target's center point.
-   [ ] **Task:** Implement the logic for a single trial that uses the player algorithm to zoom step-by-step until the trial is won.

### 3. Data Handling

-   [ ] **Task:** Add logic to `js/automated_trials.js` to record the number of moves for each completed trial.
-   [ ] **Task:** Create a function to format the array of trial results into a CSV string (e.g., `trial_number,moves`).
-   [ ] **Task:** Print the final CSV formatted data to the console after all trials have been executed.

### 4. Project Integration

-   [ ] **Task:** Add a new script to `package.json` under the `scripts` section: `"trials": "node js/automated_trials.js"`.
-   [ ] **Task:** Add a `.mjs` extension to the `js/automated_trials.js` file and other files as needed to ensure that the program runs correctly.
