import { test, expect } from '@playwright/test';

test.describe('Тестирование Конструктора Бургеров и Модальных окон (Только HAR)', () => {
  
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer-mock-token-12345',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.routeFromHAR('tests/hars/burger.har', {
      url: '**/api/**',
      update: false,
      notFound: 'fallback'
    });

    await page.goto('/');

    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token-12345');
    });
  });

  test('Проверка добавления булки и начинки в constructor', async ({ page }) => {
    const bunCard = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' }).or(
      page.getByRole('listitem').filter({ hasText: 'Флюоресцентная булка R2-D3' })
    ).first();
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page.getByRole('listitem').filter({ hasText: 'Биокотлета из марсианской Магнолии' }).or(
      page.getByRole('listitem').filter({ hasText: 'Говяжий фарш Holo-beef' })
    ).first();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.locator('.constructor-element__text').first()).toBeVisible();
  });

  test('Проверка работы модального окна ingredient (открытие и закрытие)', async ({ page }) => {
    const bunCard = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' }).or(
      page.getByRole('listitem').filter({ hasText: 'Флюоресцентная булка R2-D3' })
    ).first();
    await bunCard.click();

    const modalHeader = page.locator('h3', { hasText: 'Детали ингредиента' });
    await expect(modalHeader).toBeVisible();

    const closeButton = page.locator('#modals button').first(); 
    await closeButton.click();
    await expect(modalHeader).not.toBeVisible();
  });

  test('Проверка комплексного сценария создания заказа', async ({ page }) => {
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, name: 'Космический бургер', order: { number: 4242 } }),
      });
    });

    const bunCard = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' }).or(
      page.getByRole('listitem').filter({ hasText: 'Флюоресцентная булка R2-D3' })
    ).first();
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page.getByRole('listitem').filter({ hasText: 'Биокотлета из марсианской Магнолии' }).or(
      page.getByRole('listitem').filter({ hasText: 'Говяжий фарш Holo-beef' })
    ).first();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    const submitButton = page.locator('button', { hasText: 'Оформить заказ' });
    await submitButton.click();

    const orderModalNumber = page.locator('#modals').locator('text=4242');
    await expect(orderModalNumber).toBeVisible();

    const closeButton = page.locator('#modals button').first(); 
    await closeButton.click();
    await expect(orderModalNumber).not.toBeVisible();
  });
});
