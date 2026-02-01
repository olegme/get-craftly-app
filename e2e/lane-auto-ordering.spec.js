import { test, expect } from '@playwright/test';

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

const laneTitleWip = 'Lane E2E WIP';
const laneTitlePlanned = 'Lane E2E Planned';
const laneTitleEmpty = 'Lane E2E Empty';
const cleanupMarker = 'E2E';

async function login(page) {
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
}

async function ensureLanes(page, count) {
  const lanes = page.locator('[data-testid="lane"]');
  while (await lanes.count() < count) {
    const firstLane = lanes.first();
    await firstLane.getByTestId('lane-menu-toggle').scrollIntoViewIfNeeded();
    await firstLane.getByTestId('lane-menu-toggle').click();
    await firstLane.getByText('Add Lane', { exact: true }).click();
  }
}

async function waitForLanes(page) {
  const lanes = page.locator('[data-testid="lane"]');
  const start = Date.now();
  while (Date.now() - start < 30000) {
    if (await lanes.count() > 0) return;
    await page.waitForTimeout(500);
  }
  throw new Error('Timed out waiting for lanes to load');
}

async function renameLane(lane, title) {
  await lane.locator('h2').click();
  const input = lane.locator('input[type="text"]');
  await input.fill(title);
  await input.press('Enter');
  await expect(lane).toHaveAttribute('data-lane-title', title);
}

async function addCardToRow(lane, rowTitle, cardTitle) {
  const row = lane.locator(`[data-testid="lane-row"][data-row-title="${rowTitle}"]`);
  await row.getByRole('button', { name: 'Add task' }).click();
  await row.getByPlaceholder('New card title').fill(cardTitle);
  await row.getByPlaceholder('New card title').press('Enter');
  await expect(row.locator(`[data-card-title="${cardTitle}"]`)).toHaveCount(1);
}

async function deleteLaneIfPresent(lane) {
  await lane.getByTestId('lane-menu-toggle').scrollIntoViewIfNeeded();
  await lane.getByTestId('lane-menu-toggle').click();
  await lane.getByText('Delete Lane', { exact: true }).click();
  const confirm = lane.page().getByText('This lane contains cards. Are you sure you want to delete it?');
  if (await confirm.isVisible({ timeout: 2000 }).catch(() => false)) {
    await lane.page().getByRole('button', { name: 'Delete' }).click();
  }
}

async function cleanupLanes(page) {
  const lanes = page.locator('[data-testid="lane"]');
  let removedAny = true;
  while (removedAny) {
    removedAny = false;
    const titles = await lanes.evaluateAll(nodes =>
      nodes.map(node => {
        const attr = node.getAttribute('data-lane-title');
        if (attr) return attr;
        const heading = node.querySelector('h2');
        return heading ? heading.textContent?.trim() : null;
      })
    );
    for (let i = 0; i < titles.length; i++) {
      const title = titles[i];
      if (title && title.includes(cleanupMarker)) {
        await deleteLaneIfPresent(lanes.nth(i));
        removedAny = true;
        break;
      }
    }
  }
  if (await lanes.count() === 0) {
    await page.reload();
    await waitForLanes(page);
  }
}

test.describe('lane auto ordering', () => {
  test.skip(!email || !password, 'E2E_EMAIL and E2E_PASSWORD are required to run this test.');

  test('groups lanes by WIP then Planned then others on load', async ({ page }) => {
    const runId = Date.now().toString();
    const plannedCardTitle = `Planned Card ${runId}`;
    const wipCardTitle = `WIP Card ${runId}`;

    await login(page);

    await waitForLanes(page);
    await cleanupLanes(page);
    await ensureLanes(page, 3);

    const lanes = page.locator('[data-testid="lane"]');
    const laneA = lanes.nth(0);
    const laneB = lanes.nth(1);
    const laneC = lanes.nth(2);

    await renameLane(laneA, laneTitleEmpty);
    await renameLane(laneB, laneTitlePlanned);
    await renameLane(laneC, laneTitleWip);

    const lanePlanned = page.locator(`[data-testid="lane"][data-lane-title="${laneTitlePlanned}"]`);
    const laneWip = page.locator(`[data-testid="lane"][data-lane-title="${laneTitleWip}"]`);
    await expect(lanePlanned).toHaveCount(1);
    await expect(laneWip).toHaveCount(1);

    await addCardToRow(lanePlanned, 'Planned', plannedCardTitle);
    await addCardToRow(laneWip, 'WIP', wipCardTitle);
    await page.waitForTimeout(1000);

    await page.reload();
    await expect(page.getByText('Signed in as')).toBeVisible();
    await waitForLanes(page);

    const laneWipAfter = page.locator('[data-testid="lane"]').filter({
      has: page.getByRole('heading', { name: laneTitleWip }),
    });
    const wipRowAfter = laneWipAfter.locator('[data-testid="lane-row"][data-row-title="WIP"]');
    await expect(wipRowAfter.locator(`[data-card-title="${wipCardTitle}"]`)).toHaveCount(1);

    const orderedTitles = await page.locator('[data-testid="lane"]').evaluateAll(nodes =>
      nodes.map(node => {
        const heading = node.querySelector('h2');
        return heading ? heading.textContent?.trim() : null;
      })
    );

    const expectedOrder = [laneTitleWip, laneTitlePlanned, laneTitleEmpty];
    expectedOrder.forEach((title, idx) => {
      expect(orderedTitles[idx]).toBe(title);
    });

    await cleanupLanes(page);
  });
});
