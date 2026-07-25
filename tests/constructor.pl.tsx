import { test, expect } from '@playwright/test';
import { mockIngredients } from './ingredients.mock';

const INGREDIENTS_API = '**/api/ingredients';
const USER_API = '**/api/auth/user';
const ORDERS_API = '**/api/orders';

test.describe('Тестирование Конструктора Бургеров и Модальных окон', () => {
  
  test.beforeEach(async ({ page, context }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });

    await page.route(INGREDIENTS_API, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockIngredients }), 
      });
    });

    await page.route(USER_API, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, user: { email: 'test@example.com', name: 'John Doe' } }),
      });
    });
  });

  test('Проверка добавления булки и начинки в constructor', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('listitem')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .getByRole('listitem')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(page.locator('.constructor-element__text', { hasText: 'Краторная булка N-200i (верх)' })).toBeVisible();
    await expect(page.locator('.constructor-element__text', { hasText: 'Краторная булка N-200i (низ)' })).toBeVisible();
    await expect(page.locator('.constructor-element__text', { hasText: 'Биокотлета из марсианской Магнолии' })).toBeVisible();
  });

  test('Проверка работы модального окна ingrediente (открытие и закрытие)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' }).click();

    const modalHeader = page.locator('h3', { hasText: 'Детали ингредиента' });
    await expect(modalHeader).toBeVisible();
    await expect(page.locator('#modals')).toContainText('Краторная булка N-200i');

    const closeButton = page.locator('#modals button').first(); 
    await closeButton.click();
    await expect(modalHeader).not.toBeVisible();

    await page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' }).click();
    await expect(modalHeader).toBeVisible();

    await page.mouse.click(10, 10); 
    await expect(modalHeader).not.toBeVisible();
  });

  test('Проверка комплексного сценария создания заказа', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer-mock-token-12345',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/');

    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token-12345');
    });

    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/**',
      update: false,
    });

    await page.route(ORDERS_API, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, name: 'Космический бургер', order: { number: 4242 } }),
      });
    });

    await page
      .getByRole('listitem')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .getByRole('listitem')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    const submitButton = page.locator('button', { hasText: 'Оформить заказ' });
    await submitButton.click();

    const orderModalNumber = page.locator('#modals').locator('text=4242');
    await expect(orderModalNumber).toBeVisible();

    const closeButton = page.locator('#modals button').first(); 
    await closeButton.click();
    await expect(orderModalNumber).not.toBeVisible();

    await expect(page.locator('.constructor-element__text')).toHaveCount(0);
  });
});
