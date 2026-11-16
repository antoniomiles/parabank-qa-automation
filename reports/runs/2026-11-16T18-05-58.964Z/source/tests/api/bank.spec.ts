import { test, expect } from '@playwright/test';
import { BankApi } from '../support/bank-api';
import { newCustomer } from '../support/data';
import { BankPage } from '../support/bank-page';

test('API-01 @smoke @positive published API contract', async ({ request }, info) => {
  const response = await new BankApi(request, info).get('openapi.yaml');
  expect(response.status()).toBe(200);
  const contract = await response.text();
  expect(contract).toMatch(/openapi:\s*3\./);
  expect(contract).toContain('/login/{username}/{password}');
  expect(contract).toContain('/accounts/{accountId}');
});

test('API-02 @negative @regression invalid credentials', async ({ request }, info) => {
  const response = await new BankApi(request, info).get(`login/${newCustomer().username}/invalid`);
  expect(response.status()).toBe(400);
  expect(await response.text()).toMatch(/invalid|could not be verified/i);
});

test('API-03 @negative @regression nonexistent account', async ({ request }, info) => {
  const response = await new BankApi(request, info).get('accounts/2147483647');
  expect(response.status()).toBe(400);
  expect(await response.text()).toBe('Could not find account #2147483647');
});

test('API-04 @positive @regression customer and accounts contract', async ({ browser, playwright }, info) => {
  const context = await browser.newContext({ baseURL: info.project.use.baseURL });
  try {
    const customer = newCustomer();
    await new BankPage(await context.newPage()).register(customer);
    const request = await playwright.request.newContext({ baseURL: info.project.use.baseURL });
    try {
      const api = new BankApi(request, info);
      const login = await api.get(`login/${customer.username}/${customer.password}`);
      expect(login.status()).toBe(200);
      const body = await login.json();
      expect(body).toMatchObject({ firstName: customer.firstName, lastName: customer.lastName });
      expect(body.id).toEqual(expect.any(Number));
      const accountsResponse = await api.get(`customers/${body.id}/accounts`);
      expect(accountsResponse.status()).toBe(200);
      const accounts = await accountsResponse.json();
      expect(Array.isArray(accounts)).toBe(true);
      expect(accounts.length).toBeGreaterThan(0);
      for (const account of accounts) {
        expect(account).toMatchObject({ id: expect.any(Number), customerId: body.id, balance: expect.any(Number), type: expect.stringMatching(/^(CHECKING|SAVINGS)$/) });
      }
      const detail = await api.get(`accounts/${accounts[0].id}`);
      expect(detail.status()).toBe(200);
      expect(await detail.json()).toEqual(accounts[0]);
    } finally { await request.dispose(); }
  } finally { await context.close(); }
});
