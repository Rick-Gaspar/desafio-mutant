import { test, expect } from '@playwright/test';
import { verifyLoginSuccess, logout, verifyLogout } from './helpers';

test.describe('Cenario 4 — Logout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await verifyLoginSuccess(page);
  });

  test('retorna o usuário para a tela de login', async ({ page, context }) => {
    await logout(page);

    await verifyLogout(page);
    const cookies = await context.cookies();
    expect(cookies.find((c) => c.name === 'session-username')).toBeUndefined();
  });
});
