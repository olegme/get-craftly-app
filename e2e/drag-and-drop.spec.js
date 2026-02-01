import { test, expect } from '@playwright/test';

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

const mp3LaneTitle = 'MP3 Tag Inspector E2E';
const otherLaneTitle = 'Other Lane E2E';

async function ensureTwoLanes(page) {
  const lanes = page.locator('[data-testid="lane"]');
  const count = await lanes.count();
  if (count >= 2) return;

  const firstLane = lanes.first();
  await firstLane.getByTestId('lane-menu-toggle').click();
  await firstLane.getByText('Add Lane', { exact: true }).click();
  await expect(lanes).toHaveCount(2);
}

async function renameLane(lane, title) {
  await lane.locator('h2').click();
  const input = lane.locator('input[type="text"]');
  await input.fill(title);
  await input.press('Enter');
  await expect(lane).toHaveAttribute('data-lane-title', title);
}

test.describe('drag-and-drop regression', () => {
  test.skip(!email || !password, 'E2E_EMAIL and E2E_PASSWORD are required to run this test.');

  test('moving a card in another lane does not reset done cards', async ({ page }) => {
    const runId = Date.now().toString();
    const doneCardTitle = `Card A E2E ${runId}`;
    const movedCardTitle = `Card B E2E ${runId}`;

    await page.goto('/');

    await page.getByRole('button', { name: 'Sign In with Email/Password' }).click();
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    const signedIn = page.getByText('Signed in as');
    const authError = page.locator('.error-message');
    await Promise.race([
      signedIn.waitFor({ state: 'visible', timeout: 15000 }),
      authError.waitFor({ state: 'visible', timeout: 15000 }),
    ]);
    if (await authError.isVisible()) {
      const message = (await authError.textContent()) || 'Unknown auth error';
      throw new Error(`Login failed: ${message.trim()}`);
    }
    await expect(signedIn).toBeVisible();

    await ensureTwoLanes(page);

    const lanes = page.locator('[data-testid="lane"]');
    const laneA = lanes.nth(0);
    const laneB = lanes.nth(1);

    await renameLane(laneA, mp3LaneTitle);
    await renameLane(laneB, otherLaneTitle);

    const mp3Lane = laneA;
    const otherLane = laneB;

    const mp3WipRow = mp3Lane.locator('[data-testid="lane-row"][data-row-title="WIP"]');
    await mp3WipRow.getByRole('button', { name: 'Add task' }).click();
    await mp3WipRow.getByPlaceholder('New card title').fill(doneCardTitle);
    await mp3WipRow.getByPlaceholder('New card title').press('Enter');

    const mp3Card = mp3Lane.locator(`[data-card-title="${doneCardTitle}"]`);
    await mp3Card.getByTestId('card-complete-toggle').click();

    const mp3DoneRow = mp3Lane.locator('[data-testid="lane-row"][data-row-title="Done"]');
    await expect(mp3DoneRow.locator(`[data-card-title="${doneCardTitle}"]`)).toHaveCount(1);
    await expect(mp3DoneRow.locator(`[data-card-title="${doneCardTitle}"]`)).toHaveAttribute('data-card-completed', 'true');

    const otherPlannedRow = otherLane.locator('[data-testid="lane-row"][data-row-title="Planned"]');
    await otherPlannedRow.getByRole('button', { name: 'Add task' }).click();
    await otherPlannedRow.getByPlaceholder('New card title').fill(movedCardTitle);
    await otherPlannedRow.getByPlaceholder('New card title').press('Enter');

    const cardToMove = otherLane.locator(`[data-card-title="${movedCardTitle}"]`);
    const otherWipDrop = otherLane.locator('[data-testid="lane-row"][data-row-title="WIP"] [data-testid="dropzone"]');
    await cardToMove.dragTo(otherWipDrop);

    await expect(mp3DoneRow.locator(`[data-card-title="${doneCardTitle}"]`)).toHaveCount(1);
    await expect(mp3DoneRow.locator(`[data-card-title="${doneCardTitle}"]`)).toHaveAttribute('data-card-completed', 'true');
    await expect(mp3Lane.locator(`[data-testid="lane-row"][data-row-title="WIP"] [data-card-title="${doneCardTitle}"]`)).toHaveCount(0);
  });
});
