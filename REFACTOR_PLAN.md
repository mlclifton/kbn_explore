# File Structure Refactor Plan

This document outlines the tasks required to refactor the project's file structure for better organization and clarity.

## I. File & Directory Moves

1.  **Create New Directories:**
    *   `docs/plans/`
    *   `docs/backlogs/`
    *   `src/`
    *   `scripts/`

2.  **Move Markdown Files:**
    *   Move `IMPLEMENTATION_PLAN.md`, `PHASE_3_PLAN.md`, and `TECHNICAL_SOLUTION_DESIGN.md` into `docs/plans/`.
    *   Move `PHASE_2_BACKLOG.md` and `PHASE_3_BACKLOG.md` into `docs/backlogs/`.
    *   Move `EXPERIMENT_ANALYSIS.md` into `docs/`.

3.  **Move Source Code:**
    *   Move `js/`, `img/`, `index.html`, and `style.css` into `src/`.

4.  **Move Scripts:**
    *   Move `screenshot.mjs` into `scripts/`.

## II. Code & Configuration Changes

1.  **Update `src/index.html`:**
    *   **Line 7:** Change `<link rel="stylesheet" href="style.css">` to `<link rel="stylesheet" href="/style.css">`.
    *   **Line 14:** Change `<script type="module" src="js/main.js"></script>` to `<script type="module" src="/js/main.js"></script>`.

2.  **Update `package.json` Scripts:**
    *   **Line 10:** Change `"test": "node js/tests/simulation.test.js"` to `"test": "node src/js/tests/simulation.test.js"`.
    *   **Line 11:** Change `"trials": "node js/automated_trials.js"` to `"trials": "node src/js/automated_trials.js"`.
    *   **Line 12:** Change `"analysis": "... && node js/analysis.js < trials.csv"` to `"analysis": "... && node src/js/analysis.js < trials.csv"`.

3.  **Update `src/js/config.js`:**
    *   **Line 14:** Change `export const TARGET_IMAGE_SRC = 'img/background_image.jpg';` to `export const TARGET_IMAGE_SRC = '/img/background_image.jpg';`.

## III. Operational Changes

1.  **Web Server Configuration:**
    *   The local development web server must be configured to serve files from the `src/` directory as its document root. This is critical for the application and the `screenshot.mjs` script to function correctly.

## IV. Pre-Refactor Testing

To ensure the refactoring does not introduce regressions, the following tests must be created and passing __before__ any files are moved or modified.

### 1. New End-to-End Test File

*   **File:** `js/tests/e2e.test.js`
*   **Framework:** Playwright (already a dependency)

### 2. New Test Cases

*   **Test Case: Application Loads Successfully**
    *   **Purpose:** Verifies that `index.html` correctly loads all its CSS, JavaScript, and image dependencies after the file structure changes.
    *   **Steps:**
        1.  Start a local web server.
        2.  Use Playwright to open the application's main page.
        3.  Listen for and fail the test on any 404 console errors.
        4.  Assert that the two `<canvas>` elements are present in the DOM.
    *   **Validates:** Path changes in `index.html` and `js/config.js`.

*   **Test Case: NPM Scripts Execute Successfully**
    *   **Purpose:** Verifies that the `npm` scripts in `package.json` still function after their target file paths are updated.
    *   **Steps:**
        1.  Use Node.js's `child_process` to execute `npm test`. Assert a `0` exit code.
        2.  Use Node.js's `child_process` to execute `npm run trials`. Assert a `0` exit code.
    *   **Validates:** Path changes in the `scripts` section of `package.json`.
