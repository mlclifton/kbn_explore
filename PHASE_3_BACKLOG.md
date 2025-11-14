# Phase 3 Backlog: Data Analysis

This backlog outlines the specific tasks required to implement the data analysis script.

### 1. Enhance Data Collection

-   [x] **Task:** Add `TARGET_SIZE_RATIO_MIN` and `TARGET_SIZE_RATIO_MAX` constants to `js/config.js`.
-   [x] **Task:** Modify the `generateRandomTargetBox` function in `js/geometry.js` to use the new size ratio constants for generating random-sized targets.
-   [x] **Task:** Modify the `createInitialState` function in `js/simulation.js` to compute and store the `initialDistance` and `targetWidth` for the trial.
-   [x] **Task:** Update the `runSingleTrial` function in `js/automated_trials.js` to return the complete trial data object (`{ moves, initialDistance, targetWidth }`).
-   [x] **Task:** Update the `formatResultsToCSV` function in `js/automated_trials.js` to handle the new data fields in the CSV output.

### 2. Create Analysis Script

-   [x] **Task:** Create the new file `js/analysis.js`.
-   [x] **Task:** Implement the necessary logic in `js/analysis.js` to read all data from `process.stdin`.
-   [x] **Task:** Implement a CSV parsing function in `js/analysis.js` that converts the input string into an array of trial objects.

### 3. Implement Statistical Analysis

-   [x] **Task:** In `js/analysis.js`, create a function to calculate Mean, Median, Min, Max, and Standard Deviation for the `moves` data.
-   [x] **Task:** In `js/analysis.js`, create a function to calculate the Mode for the `moves` data.
-   [x] **Task:** In `js/analysis.js`, create a summary function to display all descriptive statistics in a formatted table.
-   [x] **Task:** In `js/analysis.js`, create a function to calculate the frequency distribution of moves.
-   [x] **Task:** In `js/analysis.js`, create a function to display the frequency distribution as a text-based histogram.

### 4. Implement Fitts's Law Analysis

-   [ ] **Task:** In `js/analysis.js`, create a function to calculate the Fitts's Law Index of Difficulty (ID) for each trial.
-   [ ] **Task:** In `js/analysis.js`, implement logic to group trials by their rounded ID.
-   [ ] **Task:** In `js/analysis.js`, calculate the average number of moves for each ID group.
-   [ ] **Task:** In `js/analysis.js`, create a function to display the Fitts's Law analysis results in a formatted table.

### 5. Streamline Execution

-   [ ] **Task:** Add the `analysis` script to `package.json` to create a processing pipeline.
-   [ ] **Task:** Add the `analysis:file` script to `package.json` to support an alternative file-based workflow.
