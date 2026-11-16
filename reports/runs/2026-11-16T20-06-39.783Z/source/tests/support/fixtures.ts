import { test as base, expect } from '@playwright/test';
import { BankPage } from './bank-page';

export const test = base.extend<{ bank: BankPage; evidence: void }>({
  bank: async ({ page }, use) => { await use(new BankPage(page)); },
  evidence: [async ({ page }, use, testInfo) => {
    await use();
    if (!page.isClosed()) {
      await testInfo.attach('final-page', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
    }
  }, { auto: true }],
});
export { expect };
