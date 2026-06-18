import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming Vite dev server runs on 3000
    await page.goto('http://localhost:3000');
  });

  test('should display main layout and columns', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Real-Time Kanban');
    await expect(page.locator('text=To Do')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=Done')).toBeVisible();
  });

  test('should open new task modal', async ({ page }) => {
    await page.click('button:has-text("New Task")');
    await expect(page.locator('h2:has-text("New Task")')).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    const taskTitle = `E2E Task ${Date.now()}`;
    
    await page.click('button:has-text("New Task")');
    await page.fill('input[placeholder="E.g., Fix login bug"]', taskTitle);
    await page.fill('textarea[placeholder="Add more details..."]', 'E2E Description');
    await page.click('button:has-text("Create Task")');

    // Modal should close and task should appear
    await expect(page.locator('h2:has-text("New Task")')).toBeHidden();
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
  });
});
