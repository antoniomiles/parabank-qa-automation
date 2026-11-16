import { expect, type Page } from '@playwright/test';
import type { Customer } from './data';

export class BankPage {
  constructor(readonly page: Page) {}

  async open(path = 'index.htm') {
    await this.page.goto(`/parabank/${path}`);
  }

  async login(username: string, password: string) {
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.getByRole('button', { name: 'Log In', exact: true }).click();
  }

  async register(customer: Customer) {
    await this.open('register.htm');
    const fields: Record<string, string> = {
      'customer.firstName': customer.firstName, 'customer.lastName': customer.lastName,
      'customer.address.street': customer.address, 'customer.address.city': customer.city,
      'customer.address.state': customer.state, 'customer.address.zipCode': customer.zipCode,
      'customer.phoneNumber': customer.phoneNumber, 'customer.ssn': customer.ssn,
      'customer.username': customer.username, 'customer.password': customer.password,
      repeatedPassword: customer.password,
    };
    for (const [id, value] of Object.entries(fields)) {
      await this.page.locator(`[id="${id}"]`).fill(value);
    }
    await this.page.getByRole('button', { name: 'Register', exact: true }).click();
    await expect(this.page.locator('#rightPanel')).toContainText(`Welcome ${customer.username}`);
    await expect(this.page.locator('#rightPanel')).toContainText('Your account was created successfully');
  }
}
