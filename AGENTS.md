# Agent Instructions for kbn_explore

This document provides guidelines for AI agents working on this codebase.

## Build, Lint, and Test

- **Test:** `npm test`
- **Run a single test:** The test runner does not support running a single test.
- **Lint:** No linter is configured.
- **Build:** No build step is required.

## Code Style

- **Formatting:**
  - Use 4-space indentation.
  - Use semicolons at the end of statements.
- **Naming:**
  - `camelCase` for variables and functions (e.g., `myVariable`).
  - `UPPER_CASE` for constants (e.g., `MAX_SIZE`).
  - `kebab-case` for filenames (e.g., `my-file.js`).
- **Imports:**
  - Use ES6 module syntax (`import { thing } from './module.js'`).
  - Group imports at the top of the file.
- **Types:**
  - This project does not use TypeScript or JSDoc.
- **Error Handling:**
  - Use `console.error` for logging errors.
  - In tests, use `try...catch` and `process.exit(1)` on failure.
- **Testing:**
  - Use the built-in `assert` module for assertions.
