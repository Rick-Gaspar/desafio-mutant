import { expect, type Page } from '@playwright/test';

export const userLogin = { user: 'standard_user', password: 'secret_sauce' };

// menasgem de erro
export const messageLogin = {
    invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
    userRequired: 'Epic sadface: Username is required',
    passwordRequired: 'Epic sadface: Password is required',
    blockedUser: 'Epic sadface: Sorry, this user has been locked out.',
    restrictedUser: (route: string) => `Epic sadface: You can only access '${route}' when you are logged in.`,
};

// preenche o login e envia
export async function login(page: Page, user: string, password: string) {
    await page.getByTestId('username').fill(user);
    await page.getByTestId('password').fill(password);
    await page.getByTestId('login-button').click();
}

// loga com sucesso e verifica se a pagina de produtos é exibida
export async function verifyLoginSuccess(page: Page) {
    await login(page, userLogin.user, userLogin.password);
    await expect(page).toHaveURL('/inventory.html');
}

// tenta fazer login e verifica se uma mensagem de erro é exibida
export async function verifyLoginFailure(page: Page, user: string, password: string) {
    await login(page, user, password);
    await expect(page.getByTestId('error')).toBeVisible();
}

// abre o menu e faz logout
export async function logout(page: Page) {
    await page.locator('#react-burger-menu-btn').click();
    await page.getByTestId('logout-sidebar-link').click();
    await expect(page).toHaveURL('/');
}

// ve se o usuario faz logout e volta para a pagina de login
export async function verifyLogout(page: Page) {
    await expect(page).toHaveURL('/'); 
    await expect(page.getByTestId('login-button')).toBeVisible();
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
    await expect(page.getByTestId('inventory-list')).toHaveCount(0);
}
