import { test, expect } from '../support/fixtures';
import { newCustomer } from '../support/data';
import { BankApi } from '../support/bank-api';
import { PaymentsPage, payee } from '../support/payments-page';

test('PAY-01 @positive @regression valid login permits bill pay', async ({ bank, page }) => {
  const customer = newCustomer();
  await bank.register(customer);
  await page.getByRole('link', { name: 'Log Out', exact: true }).click();
  await bank.login(customer.username, customer.password);
  await new PaymentsPage(page).open();
});

test('PAY-02 @positive @regression valid payment records debit and balance', async ({ bank, page }, info) => {
  await bank.register(newCustomer());
  const payments = new PaymentsPage(page);
  await payments.open();
  const accountId = await payments.accountId();
  const api = new BankApi(page.request, info);
  const beforeResponse = await api.get(`accounts/${accountId}`);
  expect(beforeResponse.status()).toBe(200);
  const before = await beforeResponse.json();
  await payments.fill('10.25');
  await payments.send();
  await expect(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeVisible();
  await expect(page.locator('#billpayResult')).toContainText(payee.name);
  await expect(page.locator('#billpayResult')).toContainText('$10.25');
  await expect(page.locator('#billpayResult')).toContainText(accountId);
  const movementsResponse = await api.get(`accounts/${accountId}/transactions`);
  expect(movementsResponse.status()).toBe(200);
  const movements = await movementsResponse.json();
  const payment = movements.find((t: { description: string }) => t.description === `Bill Payment to ${payee.name}`);
  expect(payment).toMatchObject({ accountId: Number(accountId), amount: 10.25, type: 'Debit' });
  const afterResponse = await api.get(`accounts/${accountId}`);
  expect(afterResponse.status()).toBe(200);
  expect(Math.round((await afterResponse.json()).balance * 100)).toBe(Math.round(before.balance * 100) - 1025);
  await page.getByRole('link', { name: 'Accounts Overview', exact: true }).click();
  await page.getByRole('link', { name: accountId, exact: true }).click();
  await expect(page.getByRole('link', { name: `Bill Payment to ${payee.name}`, exact: true })).toBeVisible();
});

test('PAY-03 @negative @regression required payment fields', async ({ bank, page }) => {
  await bank.register(newCustomer());
  const payments = new PaymentsPage(page);
  await payments.open();
  await payments.send();
  await expect(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeHidden();
  await expect(page.locator('#billpayForm')).toContainText('Payee name is required.');
  await expect(page.locator('#billpayForm')).toContainText('The amount cannot be empty.');
});

for (const amount of ['0', '-1']) {
  test(`PAY-${amount === '0' ? '04' : '05'} @negative @regression reject amount ${amount}`, async ({ bank, page }, info) => {
    await bank.register(newCustomer());
    const payments = new PaymentsPage(page);
    await payments.open();
    const accountId = await payments.accountId();
    const api = new BankApi(page.request, info);
    const before = await (await api.get(`accounts/${accountId}`)).json();
    const originalTransactions = await (await api.get(`accounts/${accountId}/transactions`)).json();
    await payments.fill(amount);
    await payments.send();
    // Wait for validation or a completed response before checking rejection.
    await expect(page.locator('#billpayForm .error:visible, #billpayResult:visible, #billpayError:visible').first()).toBeVisible();
    const after = await (await api.get(`accounts/${accountId}`)).json();
    const transactions = await (await api.get(`accounts/${accountId}/transactions`)).json();
    await info.attach('payment-business-check', { body: JSON.stringify({ amount, accountId, before, after, originalTransactions, transactions }, null, 2), contentType: 'application/json' });
    await expect.soft(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeHidden();
    expect.soft(after.balance).toBe(before.balance);
    expect.soft(transactions).toEqual(originalTransactions);
  });
}

test('PAY-06 @negative @regression bill pay requires authentication', async ({ bank, page }) => {
  await bank.open('billpay.htm');
  await expect(page.getByRole('button', { name: 'Send Payment', exact: true })).toBeHidden();
  await expect(page.locator('input[name="username"]')).toBeVisible();
});

test('PAY-07 @negative @regression mismatched beneficiary account', async ({ bank, page }) => {
  await bank.register(newCustomer());
  const payments = new PaymentsPage(page);
  await payments.open();
  await payments.fill('10.25', '987654321');
  await payments.send();
  await expect(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeHidden();
  await expect(page.locator('#billpayForm')).toContainText('The account numbers do not match.');
});
