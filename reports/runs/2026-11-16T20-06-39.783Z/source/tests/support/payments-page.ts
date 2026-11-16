import { expect, type Page } from '@playwright/test';

export const payee = {
  name: 'Practice Utility', street: '123 Test Street', city: 'Bogota',
  state: 'DC', zipCode: '110111', phoneNumber: '5550101234', accountNumber: '123456789',
};

export class PaymentsPage {
  constructor(readonly page: Page) {}

  async open() {
    await this.page.getByRole('link', { name: 'Bill Pay', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'Bill Payment Service' })).toBeVisible();
    await expect(this.page.locator('select[name="fromAccountId"] option').first()).toHaveAttribute('value', /^\d+$/);
  }

  async fill(amount: string, verification = payee.accountNumber) {
    const fields: Record<string, string> = {
      'payee.name': payee.name, 'payee.address.street': payee.street,
      'payee.address.city': payee.city, 'payee.address.state': payee.state,
      'payee.address.zipCode': payee.zipCode, 'payee.phoneNumber': payee.phoneNumber,
      'payee.accountNumber': payee.accountNumber, verifyAccount: verification, amount,
    };
    for (const [name, value] of Object.entries(fields)) {
      await this.page.locator(`input[name="${name}"]`).fill(value);
    }
  }

  async accountId() {
    return this.page.locator('select[name="fromAccountId"]').inputValue();
  }

  async send() {
    await this.page.getByRole('button', { name: 'Send Payment', exact: true }).click();
  }
}
