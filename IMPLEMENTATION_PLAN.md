### Strategy

My approach is to decouple the core simulation logic from the browser-based rendering, as suggested in the `TECHNICAL_SOLUTION_DESIGN.md`. I will create a new script that can be executed with Node.js to run the simulation "headlessly" (without a UI).

This script will programmatically run a large number of trials by implementing a simple, deterministic "player" algorithm. For each step in a trial, this algorithm will automatically select the grid cell that contains the center of the target, mimicking a perfect user. The script will then record the number of moves required for each trial and output the collected data in a structured format for later analysis.

### Implementation Plan

1.  **Isolate Core Logic**: I will begin by refactoring the existing code in `main.js` and `geometry.js`. The goal is to separate the pure simulation logic (state management, geometric calculations) from the browser-specific rendering and event handling code. This will create reusable modules.
2.  **Create Automated Trial Runner**: I will create a new file, `js/automated_trials.js`, which will serve as the main script for running the trials.
3.  **Implement the "Player" Algorithm**: Inside this new script, I will write the logic for the automated player. It will run a single trial by repeatedly:
    *   Calculating which grid cell contains the center of the target.
    *   Updating the simulation state to zoom into that cell.
    *   Counting the moves until the win condition is met.
4.  **Data Collection and Output**: The script will be designed to run a configurable number of trials in a loop. After all trials are complete, it will output the results (e.g., number of moves per trial) to the console in a simple, structured format like CSV for easy analysis.
5.  **Add Execution Script**: Finally, I will add a new script to the `package.json` file (e.g., `"trials": "node js/automated_trials.js"`) to provide a simple command (`npm run trials`) for executing the automated trials.
