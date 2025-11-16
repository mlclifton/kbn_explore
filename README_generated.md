# Project: Keyboard-Based Iterative Zoom Navigation

## 1. Overview

This repository contains a project to develop and test a keyboard-only navigation system for selecting precise points on a screen. The system allows a user to iteratively zoom into a target area using keyboard shortcuts, with the goal of providing a more efficient alternative to mouse navigation for keyboard-focused users.

The project includes:
- A browser-based interactive simulation to demonstrate the concept.
- A headless automated trial runner to simulate user interaction and gather performance data.
- A data analysis script that processes the trial data and evaluates the system's performance against HCI principles like Fitts's Law.

The final conclusions and analysis of the experiment can be found in [EXPERIMENT_ANALYSIS.md](EXPERIMENT_ANALYSIS.md).

## 2. Repository Structure

The repository is organized into the following key files and directories:

```
.
├── EXPERIMENT_ANALYSIS.md  # Final analysis and conclusion of the experiment.
├── IMPLEMENTATION_PLAN.md  # The implementation plan for Phase 2.
├── PHASE_2_BACKLOG.md      # The task-level backlog for Phase 2.
├── PHASE_3_BACKLOG.md      # The task-level backlog for Phase 3.
├── PHASE_3_PLAN.md         # The implementation plan for Phase 3.
├── TECHNICAL_SOLUTION_DESIGN.md # The original technical spec for the project.
├── docs/                   # Original functional specification documents.
├── img/                    # Image assets used in the web application.
├── index.html              # The entry point for the interactive web simulation.
├── js/                     # Contains all JavaScript source code.
│   ├── analysis.js         # (Node.js) Script to analyze trial data.
│   ├── automated_trials.js # (Node.js) Script to run headless trials.
│   ├── config.js           # Core configuration and constants.
│   ├── geometry.js         # Pure functions for geometric calculations.
│   ├── main.js             # (Browser) Main controller for the web app.
│   ├── renderer.js         # (Browser) Canvas rendering logic for the web app.
│   ├── simulation.js       # Core, environment-agnostic simulation logic.
│   └── tests/              # Contains unit tests for the simulation.
├── package.json            # Project configuration, dependencies, and scripts.
└── style.css               # Styles for the web application.
```

## 3. How to Run

### 3.1. Prerequisites
- [Node.js](https://nodejs.org/) (which includes npm) must be installed.

### 3.2. Installation
Clone the repository and install the dependencies:
```bash
git clone <repository_url>
cd kbn_explore
npm install
```

### 3.3. Running the Interactive Web Application
The web application (`index.html`) uses ES modules and needs to be served by a local web server. The easiest way to do this is using the `serve` package.

1.  Install `serve`:
    ```bash
    npm install -g serve
    ```
2.  Run the server from the project's root directory:
    ```bash
    serve
    ```
3.  Open your web browser and navigate to the local address provided by the server (e.g., `http://localhost:3000`).

### 3.4. Running the Experiment and Analysis
You can run the automated trials and generate the analysis report using the npm scripts defined in `package.json`.

**To run the unit tests:**
```bash
npm test
```

**To run the full analysis workflow:**
This is the primary command for the experiment. It will:
1.  Run 1000 automated trials and save the raw data to `trials.csv`.
2.  Run the analysis script on the data, saving the formatted report to `analysis_report.md`.

```bash
npm run analysis
```

After running, you can review the generated `trials.csv` and `analysis_report.md` files.

**To run only the trials:**
If you only want to see the raw CSV output printed to the console without creating any files, you can run:
```bash
npm run trials
```
