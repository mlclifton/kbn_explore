// js/analysis.js

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
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) {
        return []; // Not enough data
    }
    const header = lines.shift().split(',');
    
    return lines.map(line => {
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

    console.log(`Successfully parsed ${trials.length} trial records.`);
    
    displayDescriptiveStats(trials);
    displayFrequencyDistribution(trials);
    displayFittsLawAnalysis(trials);
}

// --- Analysis Functions ---

/**
 * Calculates and displays an analysis based on Fitts's Law.
 * @param {Array<object>} trials - The parsed trial data.
 */
function displayFittsLawAnalysis(trials) {
    // First, calculate the Index of Difficulty (ID) for each trial.
    // ID = log2(D/W + 1), where D is distance and W is width.
    const trialsWithId = trials.map(t => {
        const id = Math.log2(t.initial_distance / t.target_width + 1);
        return { ...t, id };
    });

    // Group trials by rounded ID
    const groupedById = {};
    for (const trial of trialsWithId) {
        const roundedId = Math.round(trial.id);
        if (!groupedById[roundedId]) {
            groupedById[roundedId] = [];
        }
        groupedById[roundedId].push(trial.moves);
    }

    // Calculate average moves for each ID group
    const analysisResults = {};
    for (const id in groupedById) {
        const movesArray = groupedById[id];
        const avgMoves = movesArray.reduce((sum, val) => sum + val, 0) / movesArray.length;
        analysisResults[id] = {
            'Trials': movesArray.length,
            'Avg. Moves': avgMoves.toFixed(2),
        };
    }

    console.log("\n--- Fitts's Law Analysis (ID vs. Avg. Moves) ---");
    console.table(analysisResults);
}


/**
 * Calculates and displays key descriptive statistics for the trial data.
 * @param {Array<object>} trials - The parsed trial data.
 */
function displayDescriptiveStats(trials) {
    const moves = trials.map(t => t.moves).sort((a, b) => a - b);
    const n = moves.length;

    // Mean
    const mean = moves.reduce((sum, val) => sum + val, 0) / n;

    // Median
    const mid = Math.floor(n / 2);
    const median = n % 2 === 0 ? (moves[mid - 1] + moves[mid]) / 2 : moves[mid];

    // Mode
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

    // Standard Deviation
    const stdDev = Math.sqrt(moves.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);

    console.log("\n--- Descriptive Statistics (Moves) ---");
    console.table({
        'Total Trials': n,
        'Mean': mean.toFixed(2),
        'Median': median,
        'Mode(s)': modes.join(', '),
        'Min': moves[0],
        'Max': moves[n - 1],
        'Std. Deviation': stdDev.toFixed(2),
    });
}

/**
 * Calculates and displays a frequency distribution histogram for the moves.
 * @param {Array<object>} trials - The parsed trial data.
 */
function displayFrequencyDistribution(trials) {
    const moves = trials.map(t => t.moves);
    const freq = {};
    for (const move of moves) {
        freq[move] = (freq[move] || 0) + 1;
    }

    const sortedKeys = Object.keys(freq).map(Number).sort((a, b) => a - b);
    const maxFreq = Math.max(...Object.values(freq));
    const maxBarLength = 40;

    console.log("\n--- Frequency Distribution (Moves) ---");
    for (const key of sortedKeys) {
        const count = freq[key];
        const barLength = Math.round((count / maxFreq) * maxBarLength);
        const bar = '█'.repeat(barLength);
        console.log(`${String(key).padStart(2, ' ')} | ${bar} (${count})`);
    }
}

// --- Run the analysis ---
analyze();
