// js/tests/e2e.test.js

import assert from 'assert';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import getPort from 'get-port';

const ROOT_DIR = process.cwd();

// --- Test Runner ---
async function runTestSuite(tests) {
    let server;
    let browser;
    let port;

    try {
        port = await getPort();
        server = await startServer(port);
        browser = await chromium.launch();

        for (const { testName, testFunction } of tests) {
            try {
                console.log(`🚀 RUNNING: ${testName}`);
                await testFunction(browser, port);
                console.log(`✅ PASSED: ${testName}`);
            } catch (error) {
                console.error(`❌ FAILED: ${testName}`);
                throw error; // Re-throw to be caught by the outer try-catch
            }
        }
    } catch (error) {
        console.error('\nTest suite failed:');
        console.error(error);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
        if (server) server.close();
        console.log('\nAll e2e tests completed.');
    }
}

// --- Simple Static Server ---
function startServer(port) {
    const server = http.createServer((req, res) => {
        const filePath = path.join(ROOT_DIR, req.url === '/' ? 'index.html' : req.url);
        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.jpg': 'image/jpeg',
        };
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                } else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: '+err.code+' ..\n');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });

    return new Promise((resolve) => {
        server.listen(port, () => {
            console.log(`Server listening on http://localhost:${port}`);
            resolve(server);
        });
    });
}

// --- Test Definitions ---
const tests = [
    {
        testName: 'Application Loads Successfully',
        async testFunction(browser, port) {
            const page = await browser.newPage();
            const errors = [];
            page.on('console', msg => {
                if (msg.type() === 'error' && msg.text().includes('Failed to load resource')) {
                    errors.push(msg.text());
                }
            });

            await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' });

            assert.deepStrictEqual(errors, [], 'Should not have any 404 console errors');

            const topCanvas = await page.$('#top-panel-canvas');
            const bottomCanvas = await page.$('#bottom-panel-canvas');
            assert.ok(topCanvas, 'Top canvas should be present');
            assert.ok(bottomCanvas, 'Bottom canvas should be present');
        }
    },
    {
        testName: 'NPM Scripts Execute Successfully',
        async testFunction() {
            try {
                console.log('Running "npm test"...');
                execSync('npm test', { stdio: 'inherit' });

                console.log('Running "npm run trials"...');
                execSync('npm run trials', { stdio: 'inherit' });
            } catch (error) {
                assert.fail(`NPM script failed: ${error.message}`);
            }
        }
    }
];

// --- Run the Suite ---
runTestSuite(tests);
