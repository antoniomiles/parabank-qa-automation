import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { remote } from 'webdriverio';

if (!process.env.ANDROID_UDID || !process.env.CHROMEDRIVER_PATH) {
  throw new Error('Defina ANDROID_UDID y CHROMEDRIVER_PATH');
}
const driver = await remote({
  hostname: '127.0.0.1', port: 4723, path: '/',
  capabilities: {
    platformName: 'Android', browserName: 'Chrome',
    'appium:automationName': 'UiAutomator2',
    'appium:udid': process.env.ANDROID_UDID,
    'appium:chromedriverExecutable': process.env.CHROMEDRIVER_PATH,
  },
});
try {
  await driver.url('https://parabank.parasoft.com/parabank/index.htm');
  await driver.$('input[name="username"]').waitForDisplayed({ timeout: 15000 });
  assert.match(await driver.getTitle(), /ParaBank/);
} finally {
  try {
    mkdirSync('evidence', { recursive: true });
    await driver.saveScreenshot(`evidence/${Date.now()}.png`);
  } finally { await driver.deleteSession(); }
}
