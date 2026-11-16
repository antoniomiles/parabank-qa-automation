import { test, expect } from '../support/fixtures';
import { newCustomer } from '../support/data';

test('WEB-01 @smoke @positive public home', async ({ bank, page }) => {
  await bank.open();
  await expect(page).toHaveTitle(/ParaBank/);
  await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Register', exact: true })).toBeVisible();
});

test('WEB-02 @negative @regression empty login', async ({ bank, page }) => {
  await bank.open();
  await page.getByRole('button', { name: 'Log In', exact: true }).click();
  await expect(page.locator('#rightPanel')).toContainText('Please enter a username and password');
});

test('WEB-03 @negative @regression unknown login', async ({ bank, page }) => {
  await bank.open();
  await bank.login(newCustomer().username, 'invalid');
  await expect(page.locator('#rightPanel .error')).toContainText('The username and password could not be verified');
});

test('WEB-04 @negative @regression required registration fields', async ({ bank, page }) => {
  await bank.open('register.htm');
  await page.getByRole('button', { name: 'Register', exact: true }).click();
  for (const field of ['First name', 'Last name', 'Address', 'City', 'State', 'Zip Code', 'Social Security Number', 'Username', 'Password']) {
    await expect(page.locator('#rightPanel')).toContainText(`${field} is required.`);
  }
});

test('WEB-05 @negative @regression mismatched password', async ({ bank, page }) => {
  await bank.open('register.htm');
  await page.locator('[id="customer.password"]').fill('PracticeOnly42!');
  await page.locator('[id="repeatedPassword"]').fill('Different42!');
  await page.getByRole('button', { name: 'Register', exact: true }).click();
  await expect(page.locator('#rightPanel')).toContainText('Passwords did not match.');
});

test('WEB-06 @positive @regression registration, accounts, logout and login', async ({ bank, page }) => {
  const customer = newCustomer();
  await bank.register(customer);
  await page.getByRole('link', { name: 'Accounts Overview', exact: true }).click();
  await expect(page.locator('#accountTable tbody a').first()).toHaveText(/^\d+$/);
  await expect(page.locator('#accountTable')).toContainText('Balance');
  await page.getByRole('link', { name: 'Log Out', exact: true }).click();
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await bank.login(customer.username, customer.password);
  await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
  await page.locator('#accountTable tbody a').first().click();
  await expect(page.getByRole('heading', { name: 'Account Details' })).toBeVisible();
  await expect(page.locator('#accountId')).toHaveText(/^\d+$/);
});

test('WEB-07 @positive @regression public navigation', async ({ bank, page }) => {
  await bank.open();
  await page.locator('.leftmenu').getByRole('link', { name: 'About Us' }).click();
  await expect(page.locator('#rightPanel')).toContainText('ParaSoft Demo Website');
});
