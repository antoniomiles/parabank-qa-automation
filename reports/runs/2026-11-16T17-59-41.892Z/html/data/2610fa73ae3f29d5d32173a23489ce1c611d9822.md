# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\bank.spec.ts >> API-01 @smoke @positive service status
- Location: tests\api\bank.spec.ts:6:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { BankApi } from '../support/bank-api';
  3  | import { newCustomer } from '../support/data';
  4  | import { BankPage } from '../support/bank-page';
  5  | 
  6  | test('API-01 @smoke @positive service status', async ({ request }, info) => {
  7  |   const response = await new BankApi(request, info).get('status');
> 8  |   expect(response.status()).toBe(200);
     |                             ^ Error: expect(received).toBe(expected) // Object.is equality
  9  |   expect(await response.text()).toMatch(/running/i);
  10 | });
  11 | 
  12 | test('API-02 @negative @regression invalid credentials', async ({ request }, info) => {
  13 |   const response = await new BankApi(request, info).get(`login/${newCustomer().username}/invalid`);
  14 |   expect(response.status()).toBe(400);
  15 |   expect(await response.text()).toMatch(/invalid|could not be verified/i);
  16 | });
  17 | 
  18 | test('API-03 @negative @regression nonexistent account', async ({ request }, info) => {
  19 |   const response = await new BankApi(request, info).get('accounts/2147483647');
  20 |   expect(response.status()).toBe(400);
  21 |   expect(await response.text()).toMatch(/not found|does not exist|invalid/i);
  22 | });
  23 | 
  24 | test('API-04 @positive @regression customer and accounts contract', async ({ browser, playwright }, info) => {
  25 |   const context = await browser.newContext({ baseURL: info.project.use.baseURL });
  26 |   try {
  27 |     const customer = newCustomer();
  28 |     await new BankPage(await context.newPage()).register(customer);
  29 |     const request = await playwright.request.newContext({ baseURL: info.project.use.baseURL });
  30 |     try {
  31 |       const api = new BankApi(request, info);
  32 |       const login = await api.get(`login/${customer.username}/${customer.password}`);
  33 |       expect(login.status()).toBe(200);
  34 |       const body = await login.json();
  35 |       expect(body).toMatchObject({ firstName: customer.firstName, lastName: customer.lastName });
  36 |       expect(body.id).toEqual(expect.any(Number));
  37 |       const accountsResponse = await api.get(`customers/${body.id}/accounts`);
  38 |       expect(accountsResponse.status()).toBe(200);
  39 |       const accounts = await accountsResponse.json();
  40 |       expect(Array.isArray(accounts)).toBe(true);
  41 |       expect(accounts.length).toBeGreaterThan(0);
  42 |       for (const account of accounts) {
  43 |         expect(account).toMatchObject({ id: expect.any(Number), customerId: body.id, balance: expect.any(Number), type: expect.stringMatching(/^(CHECKING|SAVINGS)$/) });
  44 |       }
  45 |       const detail = await api.get(`accounts/${accounts[0].id}`);
  46 |       expect(detail.status()).toBe(200);
  47 |       expect(await detail.json()).toEqual(accounts[0]);
  48 |     } finally { await request.dispose(); }
  49 |   } finally { await context.close(); }
  50 | });
  51 | 
```