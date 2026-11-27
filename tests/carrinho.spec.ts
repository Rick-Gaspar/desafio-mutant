import { test, expect } from '@playwright/test';
import { verifyLoginSuccess, logout, messageLogin } from './helpers';

test.describe('Cenário 3 — Adição de produto ao carrinho', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await verifyLoginSuccess(page);
  });

  test('produto adicionado aparece listado no carrinho', async ({ page }) => {
    // Adiciona o produto
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();

    // Acessa o carrinho
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Your Cart');

    // Valida o item listado
    const itens = page.getByTestId('inventory-item');
    await expect(itens).toHaveCount(1);
    await expect(itens.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    await expect(itens.getByTestId('inventory-item-price')).toHaveText('$29.99');
    await expect(itens.getByTestId('item-quantity')).toHaveText('1');
  });

  test('Edge caseadicionar dois produtos no carrinho @edge', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');

    await page.getByTestId('shopping-cart-link').click();
    await expect(page.getByTestId('inventory-item-name')).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
  });


  test('Edge case - c arrinho continua com o item após logout e novo login @interrupcao', async ({ page }) => {
    // Comportamento atual do site: o carrinho fica salvo no navegador (localStorage). Não é limpo no logout. Fica documentado como ponto de atenção no README.
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await logout(page);
    await verifyLoginSuccess(page);

    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });
});
