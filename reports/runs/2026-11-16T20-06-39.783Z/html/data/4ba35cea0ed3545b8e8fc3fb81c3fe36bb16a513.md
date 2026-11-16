# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\payments.spec.ts >> PAY-04 @negative @regression reject amount 0
- Location: tests\web\payments.spec.ts:54:3

# Error details

```
Error: expect(locator).toBeHidden() failed

Locator:  getByRole('heading', { name: 'Bill Payment Complete' })
Expected: hidden
Received: visible
Timeout:  10000ms

Call log:
  - Expect "soft toBeHidden" getByRole('heading', { name: 'Bill Payment Complete' }) with timeout 10000ms
  - waiting for getByRole('heading', { name: 'Bill Payment Complete' })
    23 × locator resolved to <h1 class="title">Bill Payment Complete</h1>
       - unexpected value "visible"

```

```yaml
- heading "Bill Payment Complete" [level=1]
```

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 10

- Array []
+ Array [
+   Object {
+     "accountId": 106140,
+     "amount": 0,
+     "date": 1794787200000,
+     "description": "Bill Payment to Practice Utility",
+     "id": 155668,
+     "type": "Debit",
+   },
+ ]
```

# Test source

```ts
  1  | import { test, expect } from '../support/fixtures';
  2  | import { newCustomer } from '../support/data';
  3  | import { BankApi } from '../support/bank-api';
  4  | import { PaymentsPage, payee } from '../support/payments-page';
  5  | 
  6  | test('PAY-01 @positive @regression valid login permits bill pay', async ({ bank, page }) => {
  7  |   const customer = newCustomer();
  8  |   await bank.register(customer);
  9  |   await page.getByRole('link', { name: 'Log Out', exact: true }).click();
  10 |   await bank.login(customer.username, customer.password);
  11 |   await new PaymentsPage(page).open();
  12 | });
  13 | 
  14 | test('PAY-02 @positive @regression valid payment records debit and balance', async ({ bank, page }, info) => {
  15 |   await bank.register(newCustomer());
  16 |   const payments = new PaymentsPage(page);
  17 |   await payments.open();
  18 |   const accountId = await payments.accountId();
  19 |   const api = new BankApi(page.request, info);
  20 |   const beforeResponse = await api.get(`accounts/${accountId}`);
  21 |   expect(beforeResponse.status()).toBe(200);
  22 |   const before = await beforeResponse.json();
  23 |   await payments.fill('10.25');
  24 |   await payments.send();
  25 |   await expect(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeVisible();
  26 |   await expect(page.locator('#billpayResult')).toContainText(payee.name);
  27 |   await expect(page.locator('#billpayResult')).toContainText('$10.25');
  28 |   await expect(page.locator('#billpayResult')).toContainText(accountId);
  29 |   await info.attach('payment-confirmation', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  30 |   const movementsResponse = await api.get(`accounts/${accountId}/transactions`);
  31 |   expect(movementsResponse.status()).toBe(200);
  32 |   const movements = await movementsResponse.json();
  33 |   const payment = movements.find((t: { description: string }) => t.description === `Bill Payment to ${payee.name}`);
  34 |   expect(payment).toMatchObject({ accountId: Number(accountId), amount: 10.25, type: 'Debit' });
  35 |   const afterResponse = await api.get(`accounts/${accountId}`);
  36 |   expect(afterResponse.status()).toBe(200);
  37 |   expect(Math.round((await afterResponse.json()).balance * 100)).toBe(Math.round(before.balance * 100) - 1025);
  38 |   await page.getByRole('link', { name: 'Accounts Overview', exact: true }).click();
  39 |   await page.getByRole('link', { name: accountId, exact: true }).click();
  40 |   await expect(page.getByRole('link', { name: `Bill Payment to ${payee.name}`, exact: true })).toBeVisible();
  41 | });
  42 | 
  43 | test('PAY-03 @negative @regression required payment fields', async ({ bank, page }) => {
  44 |   await bank.register(newCustomer());
  45 |   const payments = new PaymentsPage(page);
  46 |   await payments.open();
  47 |   await payments.send();
  48 |   await expect(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeHidden();
  49 |   await expect(page.locator('#billpayForm')).toContainText('Payee name is required.');
  50 |   await expect(page.locator('#billpayForm')).toContainText('The amount cannot be empty.');
  51 | });
  52 | 
  53 | for (const amount of ['0', '-1']) {
  54 |   test(`PAY-${amount === '0' ? '04' : '05'} @negative @regression reject amount ${amount}`, async ({ bank, page }, info) => {
  55 |     await bank.register(newCustomer());
  56 |     const payments = new PaymentsPage(page);
  57 |     await payments.open();
  58 |     const accountId = await payments.accountId();
  59 |     const api = new BankApi(page.request, info);
  60 |     const before = await (await api.get(`accounts/${accountId}`)).json();
  61 |     const originalTransactions = await (await api.get(`accounts/${accountId}/transactions`)).json();
  62 |     await payments.fill(amount);
  63 |     await payments.send();
  64 |     // Wait for validation or a completed response before checking rejection.
  65 |     await expect(page.locator('#billpayForm .error:visible, #billpayResult:visible, #billpayError:visible').first()).toBeVisible();
  66 |     const after = await (await api.get(`accounts/${accountId}`)).json();
  67 |     const transactions = await (await api.get(`accounts/${accountId}/transactions`)).json();
  68 |     await info.attach('payment-business-check', { body: JSON.stringify({ amount, accountId, before, after, originalTransactions, transactions }, null, 2), contentType: 'application/json' });
  69 |     await expect.soft(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeHidden();
  70 |     expect.soft(after.balance).toBe(before.balance);
> 71 |     expect.soft(transactions).toEqual(originalTransactions);
     |                               ^ Error: expect(received).toEqual(expected) // deep equality
  72 |   });
  73 | }
  74 | 
  75 | test('PAY-06 @negative @regression bill pay requires authentication', async ({ bank, page }) => {
  76 |   await bank.open('billpay.htm');
  77 |   await expect(page.getByRole('button', { name: 'Send Payment', exact: true })).toBeHidden();
  78 |   await expect(page.locator('input[name="username"]')).toBeVisible();
  79 | });
  80 | 
  81 | test('PAY-07 @negative @regression mismatched beneficiary account', async ({ bank, page }) => {
  82 |   await bank.register(newCustomer());
  83 |   const payments = new PaymentsPage(page);
  84 |   await payments.open();
  85 |   await payments.fill('10.25', '987654321');
  86 |   await payments.send();
  87 |   await expect(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeHidden();
  88 |   await expect(page.locator('#billpayForm')).toContainText('The account numbers do not match.');
  89 | });
  90 | 
```