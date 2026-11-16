# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\banking.spec.ts >> WEB-05 @negative @regression mismatched password
- Location: tests\web\banking.spec.ts:31:1

# Error details

```
Error: page.goto: net::ERR_NETWORK_ACCESS_DENIED at https://parabank.parasoft.com/parabank/register.htm
Call log:
  - navigating to "https://parabank.parasoft.com/parabank/register.htm", waiting until "load"

```

# Test source

```ts
  1  | import { expect, type Page } from '@playwright/test';
  2  | import type { Customer } from './data';
  3  | 
  4  | export class BankPage {
  5  |   constructor(readonly page: Page) {}
  6  | 
  7  |   async open(path = 'index.htm') {
> 8  |     await this.page.goto(`/parabank/${path}`);
     |                     ^ Error: page.goto: net::ERR_NETWORK_ACCESS_DENIED at https://parabank.parasoft.com/parabank/register.htm
  9  |   }
  10 | 
  11 |   async login(username: string, password: string) {
  12 |     await this.page.locator('input[name="username"]').fill(username);
  13 |     await this.page.locator('input[name="password"]').fill(password);
  14 |     await this.page.getByRole('button', { name: 'Log In', exact: true }).click();
  15 |   }
  16 | 
  17 |   async register(customer: Customer) {
  18 |     await this.open('register.htm');
  19 |     const fields: Record<string, string> = {
  20 |       'customer.firstName': customer.firstName, 'customer.lastName': customer.lastName,
  21 |       'customer.address.street': customer.address, 'customer.address.city': customer.city,
  22 |       'customer.address.state': customer.state, 'customer.address.zipCode': customer.zipCode,
  23 |       'customer.phoneNumber': customer.phoneNumber, 'customer.ssn': customer.ssn,
  24 |       'customer.username': customer.username, 'customer.password': customer.password,
  25 |       repeatedPassword: customer.password,
  26 |     };
  27 |     for (const [id, value] of Object.entries(fields)) {
  28 |       await this.page.locator(`[id="${id}"]`).fill(value);
  29 |     }
  30 |     await this.page.getByRole('button', { name: 'Register', exact: true }).click();
  31 |     await expect(this.page.locator('#rightPanel')).toContainText(`Welcome ${customer.username}`);
  32 |     await expect(this.page.locator('#rightPanel')).toContainText('Your account was created successfully');
  33 |   }
  34 | }
  35 | 
```