// js/analysis.js

import fs from 'fs';

/**
 * Reads all data from stdin.
 * @returns {Promise<string>} A promise that resolves with the full input string.
 */
function readStdin() {
    return new Promise((resolve, reject) => {
        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', () => {
            let chunk;
            while ((chunk = process.stdin.read()) !== null) {
                data += chunk;
            }
        });
        process.stdin.on('end', () => {
            resolve(data);
        });
        process.stdin.on('error', reject);
    });
}

/**
 * Parses a raw CSV string into an array of structured objects.
 * @param {string} csvString - The raw CSV data.
 * @returns {Array<object>} An array of trial data objects.
 */
function parseCSV(csvString) {
    const allLines = csvString.trim().split('\n');
    
    // Find the start of the actual CSV data
    const csvStartIndex = allLines.findIndex(line => line.startsWith('trial_number,moves,initial_distance,target_width'));

    if (csvStartIndex === -1) {
        console.error("Error: Could not find CSV header in input.");
        return [];
    }

    const csvLines = allLines.slice(csvStartIndex);

    if (csvLines.length < 2) {
        return []; // Not enough data
    }
    const header = csvLines.shift().split(',');
    
    return csvLines.map(line => {
        const values = line.split(',');
        return header.reduce((obj, key, index) => {
            // Convert numeric values from string to float
            obj[key] = parseFloat(values[index]);
            return obj;
        }, {});
    });
}


/**
 * Main analysis function.
 */
async function analyze() {
    const rawData = await readStdin();
    if (!rawData) {
        console.error("No data received from stdin. Did you pipe the trial results?");
        console.error("Usage: npm run trials | node js/analysis.js");
        return;
    }

    const trials = parseCSV(rawData);
    if (trials.length === 0) {
        console.error("Failed to parse any trial data.");
        return;
    }

    const reportLines = [];
    reportLines.push('# Analysis Report');
    reportLines.push(`\nAnalysis based on **${trials.length}** trial records.`);

    // Get analysis sections
    reportLines.push(getDescriptiveStats(trials));
    reportLines.push(getFrequencyDistribution(trials));
    reportLines.push(getFittsLawAnalysis(trials));

    // Write report to file
    const reportContent = reportLines.join('\n');
    fs.writeFileSync('analysis_report.md', reportContent);

    console.log("✅ Analysis complete. Report saved to analysis_report.md");
}

// --- Analysis Functions ---

/**
 * Generates a markdown table for descriptive statistics.
 * @param {Array<object>} trials - The parsed trial data.
 * @returns {string} The formatted markdown section.
 */
function getDescriptiveStats(trials) {
    const moves = trials.map(t => t.moves).sort((a, b) => a - b);
    const n = moves.length;

    const mean = moves.reduce((sum, val) => sum + val, 0) / n;
    const mid = Math.floor(n / 2);
    const median = n % 2 === 0 ? (moves[mid - 1] + moves[mid]) / 2 : moves[mid];

    const modeMap = {};
    let maxFreq = 0;
    let modes = [];
    for (const move of moves) {
        modeMap[move] = (modeMap[move] || 0) + 1;
        if (modeMap[move] > maxFreq) {
            maxFreq = modeMap[move];
            modes = [move];
        } else if (modeMap[move] === maxFreq) {
            modes.push(move);
        }
    }

    const stdDev = Math.sqrt(moves.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);

    const lines = [
        '\n## Descriptive Statistics (Moves)',
        '| Metric         | Value    |',
        '|----------------|----------|',
        `| Total Trials   | ${n}        |`,
        `| Mean           | ${mean.toFixed(2)}    |`,
        `| Median         | ${median}        |`,
        `| Mode(s)        | ${modes.join(', ')}    |`,
        `| Min            | ${moves[0]}        |`,
        `| Max            | ${moves[n - 1]}        |`,
        `| Std. Deviation | ${stdDev.toFixed(2)}    |`,
    ];
    return lines.join('\n');
}

/**
 * Generates a markdown histogram for the frequency distribution.
 * @param {Array<object>} trials - The parsed trial data.
 * @returns {string} The formatted markdown section.
 */
function getFrequencyDistribution(trials) {
    const moves = trials.map(t => t.moves);
    const freq = {};
    for (const move of moves) {
        freq[move] = (freq[move] || 0) + 1;
    }

    const sortedKeys = Object.keys(freq).map(Number).sort((a, b) => a - b);
    const maxFreq = Math.max(...Object.values(freq));
    const maxBarLength = 40;

    const lines = ['\n## Frequency Distribution (Moves)', '```text'];
    for (const key of sortedKeys) {
        const count = freq[key];
        const barLength = Math.round((count / maxFreq) * maxBarLength);
        const bar = '█'.repeat(barLength);
        lines.push(`${String(key).padStart(2, ' ')} | ${bar} (${count})`);
    }
    lines.push('```');
    return lines.join('\n');
}


/**
 * Generates a markdown table for the Fitts's Law analysis.
 * @param {Array<object>} trials - The parsed trial data.
 * @returns {string} The formatted markdown section.
 */
function getFittsLawAnalysis(trials) {
    const trialsWithId = trials.map(t => {
        const id = Math.log2(t.initial_distance / t.target_width + 1);
        return { ...t, id };
    });

    const groupedById = {};
    for (const trial of trialsWithId) {
        const roundedId = Math.round(trial.id);
        if (!groupedById[roundedId]) {
            groupedById[roundedId] = [];
        }
        groupedById[roundedId].push(trial.moves);
    }

    const lines = [
        "\n## Fitts's Law Analysis (ID vs. Avg. Moves)",
        '| Index of Difficulty (ID) | Trials | Avg. Moves |',
        '|--------------------------|--------|------------|',
    ];

    const sortedIds = Object.keys(groupedById).map(Number).sort((a, b) => a - b);

    for (const id of sortedIds) {
        const movesArray = groupedById[id];
        const avgMoves = movesArray.reduce((sum, val) => sum + val, 0) / movesArray.length;
        lines.push(`| ${id}                        | ${movesArray.length}      | ${avgMoves.toFixed(2)}      |`);
    }
    
    return lines.join('\n');
}

// --- Run the analysis ---
analyze();

