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
    // Analysis logic from subsequent epics will go here.
}

// --- Run the analysis ---
analyze();
