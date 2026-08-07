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

  await context.addInitScript(() => {
    window.localStorage.setItem('refreshToken', 'mock-refresh-token-12345');
  });

  await page.routeFromHAR('tests/hars/burger.har', {
    url: '**/api/**',
    update: false,
  });

  await page.goto('/');
});

  test('Проверка добавления булки и начинки в constructor', async ({ page }) => {
    const bunCard = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' }).first();
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page.getByRole('listitem').filter({ hasText: 'Биокотлета из марсианской Магнолии' }).first();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.locator('.constructor-element__text', { hasText: 'Краторная булка N-200i (верх)' })).toBeVisible();
  });

  test('Проверка работы модального окна ingredient (открытие и закрытие)', async ({ page }) => {
    const bunCard = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' }).first();
    await bunCard.click();

    const modalHeader = page.locator('h3', { hasText: 'Детали ингредиента' });
    await expect(modalHeader).toBeVisible();

    const closeButton = page.locator('#modals button').first();
    await closeButton.click();
    
    await expect(modalHeader).not.toBeVisible();
  });

  test('Проверка комплексного сценария создания заказа', async ({ page }) => {
    const bunCard = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' }).first();
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page.getByRole('listitem').filter({ hasText: 'Биокотлета из марсианской Магнолии' }).first();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    const submitButton = page.locator('button', { hasText: 'Оформить заказ' });
    await submitButton.click();

    const orderTitle = page.locator('text=идентификатор заказа').first();
    await expect(orderTitle).toBeVisible();

    const orderNumberText = page.locator('text=108518');
    await expect(orderNumberText).toBeVisible();

    const closeButton = page.locator('#modals button').first();
    await closeButton.click();
    await expect(orderTitle).not.toBeVisible();

    await expect(page.locator('.constructor-element__text')).toHaveCount(0);
  });
});
