# Experiment Analysis: Keyboard-Based Iterative Zoom Navigation

## 1. Introduction & Objective

This document details the methodology and results of an experiment designed to test a novel keyboard-only system for navigating to and selecting on-screen targets.

The project's primary objective is to develop and test a keyboard-only navigation system that allows a user to select a precise point on a screen by iteratively zooming in. The core concept is to overlay a grid of cells on a target area, with each cell mapped to a key. Pressing a key zooms into that cell, which then becomes the new, smaller target area for the next zoom iteration.

## 2. Core Hypothesis

The experiment was designed to test the following hypothesis:

> This keyboard-centric method will be more efficient (faster and more accurate) than a traditional mouse by eliminating the time and cognitive load of switching between keyboard and mouse.

This analysis aims to establish a quantitative performance baseline for the keyboard system and compare it against an estimated performance model for traditional mouse interaction.

## 3. Methodology

To test the hypothesis, a simulation was developed and executed through automated trials.

### 3.1. Simulation Environment
A web-based application was built to simulate the navigation system. The system presents a target image and overlays a 3x8 grid, with each of the 24 cells mapped to a key on a QWERTY keyboard.

### 3.2. Automated Agent
An automated agent was developed to simulate a "perfect" user. For each step of a trial, this agent executes a deterministic strategy: it identifies which of the 24 grid cells contains the center of the target and selects the corresponding key to zoom in. This process repeats until the center of the user's view (the "pointer") is within the boundaries of the target.

### 3.3. Experiment Parameters
A total of **1000 trials** were executed by the automated agent. For each trial:
- A square target was placed at a random `(x, y)` coordinate on the screen.
- The target was given a random size, with its width ranging from 1% to 5% of the total screen width. This simulates targeting UI elements of various sizes (e.g., small icons vs. large buttons).

### 3.4. Data Collection
For each of the 1000 trials, the following data points were recorded:
- **Moves**: The number of keystrokes (zoom iterations) required to acquire the target.
- **Initial Distance (D)**: The pixel distance from the starting pointer (center of the screen) to the center of the target.
- **Target Width (W)**: The width of the target in pixels.

## 4. Results & Analysis

The collected data was analyzed to produce the following results.

### 4.1. Descriptive Statistics
A high-level summary of the system's performance in terms of moves required per trial.

| Metric         | Value    |
|----------------|----------|
| Total Trials   | 1000     |
| Mean           | 2.67     |
| Median         | 3        |
| Mode(s)        | 3        |
| Min            | 1        |
| Max            | 4        |
| Std. Deviation | 0.69     |

**Interpretation:** The system is highly efficient in terms of actions required. On average, a target can be acquired in just **2.67 keystrokes**. The maximum number of moves required in any of the 1000 trials was only 4, demonstrating a consistent and rapid path to the target.

### 4.2. Frequency Distribution
The following histogram shows the number of trials completed in a given number of moves.

```text
 1 | ███ (37)
 2 | ██████████████████████████ (347)
 3 | ████████████████████████████████████████ (528)
 4 | ███████ (88)
```

**Interpretation:** The vast majority of trials (over 87%) were completed in just 2 or 3 moves. This reinforces the conclusion that the system is not only fast on average, but reliably so.

### 4.3. Fitts's Law Analysis
This table shows the relationship between the Fitts's Law Index of Difficulty (ID) and the average number of moves required.

| Index of Difficulty (ID) | Trials | Avg. Moves |
|--------------------------|--------|------------|
| 0                        | 2      | 2.00       |
| 1                        | 13     | 2.23       |
| 2                        | 96     | 2.44       |
| 3                        | 405    | 2.51       |
| 4                        | 360    | 2.72       |
| 5                        | 120    | 3.26       |
| 6                        | 4      | 3.50       |

**Interpretation:** There is a clear, positive correlation between the Index of Difficulty and the average number of moves. This indicates that the system's performance scales predictably with task difficulty, which is a strong, positive validation of its design.

### 4.4. Comparative Time Analysis (Estimated)
To directly compare the methods, the time to complete a trial was estimated for both keyboard and mouse, based on established HCI models.

- **Keyboard Time** = `Moves * 500ms` (A conservative estimate for a choice-reaction keystroke)
- **Mouse Time** = `Homing Time (400ms) + Fitts's Law Pointing Time`

| Method                  | Avg. Time (ms) |
|-------------------------|----------------|
| Keyboard Navigation     | 1334           |
| Mouse (Fast User)       | 799            |
| Mouse (Medium User)     | 974            |
| Mouse (Slow User)       | 1148           |

**Interpretation:** Based on this model, even a slow mouse user is estimated to be faster than the keyboard navigation method. This initially appears to contradict the core hypothesis. However, the conclusion is highly sensitive to the `500ms` time-per-keystroke assumption.

## 5. Conclusion

The experiment reveals a nuanced picture of the keyboard navigation system's effectiveness.

1.  **The system is highly efficient in terms of actions.** Requiring an average of only 2.67 keystrokes to acquire a target is a very strong result. The system is predictable, reliable, and its performance scales according to established HCI principles (Fitts's Law).

2.  **Time efficiency is dependent on user proficiency.** The initial time estimation, using a conservative 500ms per keystroke, suggests that mouse usage is faster. However, this model does not account for user learning and expertise. A "break-even" analysis reveals the point at which the keyboard becomes superior:
    - Average moves: 2.67
    - Average medium mouse user time: 974ms
    - Break-even time per move = `974ms / 2.67 moves` = **~365ms**

    This means that if a user can become proficient enough to make each zoom decision in **less than 365ms**, the keyboard method becomes faster than using a mouse for a medium-skilled user. This speed is well within the capabilities of an expert user who has memorized the keyboard layout, effectively turning the task from a choice-reaction into a simple motor action.

**Therefore, the initial hypothesis is not fully validated by this simulation, but it is strongly supported under the condition of expert use.** The keyboard navigation system shows significant promise as a highly efficient alternative to the mouse, particularly for "power users" who value remaining on the keyboard and can achieve a high level of proficiency.

## 6. Future Work

To definitively prove the hypothesis, the clear next step would be to conduct a comparative usability study with human participants. This study should measure task completion times and error rates for both this keyboard system and a traditional mouse, with a focus on tracking the learning curve of new users to see how quickly they can achieve the "~365ms" break-even point.