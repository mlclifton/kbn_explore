// screenshot.mjs
import { chromium } from 'playwright';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    let browser;
    try {
        console.log('Launching browser...');
        browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();

        console.log('Navigating to http://localhost:8000...');
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

        // Wait for the canvases to be ready, just in case.
        await page.waitForSelector('#bottom-panel-canvas');

        // 1. Capture the initial state
        console.log('Taking initial screenshot...');
        await page.screenshot({ path: 'screenshot_initial.png' });
        console.log('Initial screenshot saved to screenshot_initial.png');

        // 2. Press Space and capture the running state
        console.log('Pressing Space to start trial...');
        await page.keyboard.press('Space');
        await delay(500); // Wait for UI to update

        console.log('Taking running state screenshot...');
        await page.screenshot({ path: 'screenshot_running.png' });
        console.log('Running state screenshot saved to screenshot_running.png');

    } catch (error) {
        console.error('Error taking screenshot:', error);
    } finally {
        if (browser) {
            await browser.close();
            console.log('Browser closed.');
        }
    }
})();
