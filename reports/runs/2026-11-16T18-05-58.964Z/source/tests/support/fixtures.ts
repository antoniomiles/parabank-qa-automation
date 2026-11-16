import { test as base, expect } from '@playwright/test';
import { BankPage } from './bank-page';

export const test = base.extend<{ bank: BankPage }>({
  bank: async ({ page }, use) => { await use(new BankPage(page)); },
});
test.afterEach(async ({ page }, testInfo) => {
  if (!page.isClosed()) {
    await testInfo.attach('final-page', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  }
});
export { expect };
