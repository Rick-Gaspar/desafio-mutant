import { test, expect } from '@playwright/test';
import { login, verifyLoginSuccess, userLogin, messageLogin } from './helpers';

// every test starts on the login page
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Cenario 1 - Login com Sucesso', () => {
  test('Login com usuario valido mostra a pagina de produtos', async ({ page }) => {
    await verifyLoginSuccess(page);

    // logado e sessao criada
    await expect(page).toHaveURL(/\/inventory\.html$/);
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === 'session-username')?.value).toBe(userLogin.user);

    // exibe a pagina de produtos
    await expect(page.getByTestId('title')).toHaveText('Products');
    await expect(page.getByTestId('inventory-list')).toBeVisible();
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
    await expect(page.getByTestId('shopping-cart-link')).toBeVisible();
  });
});

test.describe('Cenario 2 - Login Invalido', () => {
  test('Senha incorreta, exibe mensagem de erro', async ({ page }) => {
    await login(page, userLogin.user, 'wrong_password');

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toHaveText(messageLogin.invalidCredentials);
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(page.getByTestId('inventory-list')).toHaveCount(0);
  });

  // Alguns edge cases
  const invalidCases = [
    { id: 'test01', description: 'usuario-inexistente', user: 'usuario-inexistente', password: userLogin.password, error: messageLogin.invalidCredentials },
    { id: 'test02', description: 'username e password vazios', user: '', password: '', error: messageLogin.userRequired },
    { id: 'test03', description: 'password vazio', user: userLogin.user, password: '', error: messageLogin.passwordRequired },
    { id: 'test04', description: 'username vazio', user: '', password: userLogin.password, error: messageLogin.userRequired },
    { id: 'test05', description: 'usuario bloqueado', user: 'locked_out_user', password: userLogin.password, error: messageLogin.blockedUser },
  ];

  for (const testCase of invalidCases) {
    test(`${testCase.id} - ${testCase.description} shows an error message @edge`, async ({ page }) => {
      await login(page, testCase.user, testCase.password);
      await expect(page.getByTestId('error')).toHaveText(testCase.error);
      await expect(page).toHaveURL(/saucedemo\.com\/$/);
    });
  }

});

test('Conexão cai e retorna @interruption', async ({ page, context }) => {
  await verifyLoginSuccess(page);

  await context.setOffline(true);
  await expect(page.reload()).rejects.toThrow();

  await context.setOffline(false);
  await page.goto('/inventory.html');
  await expect(page.getByTestId('title')).toHaveText('Products');
});
