const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3001/login', { timeout: 10000 });
    await page.waitForSelector('h2', { timeout: 5000 });
    await page.screenshot({ path: 'screenshot_login.png' });
    console.log('Login page loaded and screenshot taken.');
  } catch (err) {
    console.error('Error loading login page:', err);
    await page.screenshot({ path: 'screenshot_error.png' });
  } finally {
    await browser.close();
  }
})();
